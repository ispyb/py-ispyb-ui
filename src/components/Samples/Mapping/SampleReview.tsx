import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { useSuspense } from 'rest-hooks';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from 'react-router-dom';

import { SampleResource } from 'api/resources/Sample';
import { usePath } from 'hooks/usePath';

import SubSampleList from './SubSampleList';
import SubSampleView from './SubSampleView';
import SampleCanvas from './SampleCanvas';
import { debounce } from 'lodash';
import { X } from 'react-bootstrap-icons';

function SubSamplePanel({
  blSampleId,
  selectedSubSample,
  setSelectedSubSample,
}: {
  blSampleId: number;
  selectedSubSample: number | undefined;
  setSelectedSubSample: (blSubsampleId: number) => void;
}) {
  return (
    <>
      <Suspense fallback="subsample list loading">
        <SubSampleList
          blSampleId={blSampleId}
          selectedSubSample={selectedSubSample}
          selectSubSample={setSelectedSubSample}
        />
      </Suspense>
      {selectedSubSample && (
        <Suspense fallback="subsample view loading">
          <SubSampleView blSubSampleId={selectedSubSample} />
        </Suspense>
      )}
      {!selectedSubSample && <div>Please select a subsample</div>}
    </>
  );
}

function SampleReviewMain() {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  // @ts-ignore
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const [canvasMounted, setCanvasMount] = useState<boolean>(true);
  const proposal = usePath('proposal');
  const samples = useSuspense(SampleResource.getList, {
    ...(proposal ? { proposal } : null),
    order: 'asc',
    order_by: 'name',
    ...(searchParamsObj.sample ? { search: searchParamsObj.sample } : null),
  });
  const [selectedSample, setSelectedSample] = useState<number | undefined>(
    searchParamsObj.blSampleId
      ? parseInt(searchParamsObj.blSampleId)
      : samples.results.length
      ? samples.results[0].blSampleId
      : undefined
  );
  console.log('Selected sample', selectedSample);
  const [selectedSubSample, setSelectedSubSample] = useState<number>();

  useEffect(() => {
    setSelectedSubSample(undefined);
  }, [selectedSample]);

  console.log('SampleReviewMain render', selectedSample);

  const selectSample = useCallback(
    (blSampleId: number) => {
      setSelectedSample(blSampleId);
      setCanvasMount(false);
      setTimeout(() => {
        setCanvasMount(true);
      }, 100);
      navigate({
        pathname: '',
        search: createSearchParams({
          ...searchParamsObj,
          blSampleId: `${blSampleId}`,
        }).toString(),
      });
    },
    [setSelectedSample, setCanvasMount, navigate, searchParamsObj]
  );

  useEffect(() => {
    if (samples.results.length === 1)
      selectSample(samples.results[0].blSampleId);
  }, [samples.results]); // eslint-disable-line react-hooks/exhaustive-deps

  const search = useCallback(
    (term: string) => {
      const { sample, ...newSearchParamsObj } = searchParamsObj;
      navigate({
        pathname: '',
        search: createSearchParams({
          ...newSearchParamsObj,
          ...(term ? { sample: term } : null),
        }).toString(),
      });
    },
    [navigate, searchParamsObj]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(search, 200), [search]);

  const clearSearch = useCallback(() => {
    search('');
    if (searchRef.current) searchRef.current.value = '';
  }, [search]);

  console.log('vancas mount', canvasMounted);

  return (
    <>
      <div key="header"></div>
      <Container fluid>
        {selectedSample && (
          <Row>
            <Col sm={9}>
              {canvasMounted ? (
                <Suspense fallback="Loading sample canvas">
                  <SampleCanvas
                    blSampleId={selectedSample}
                    selectedSubSample={selectedSubSample}
                    selectSample={
                      <>
                        <Form.Control
                          placeholder="Search"
                          onChange={(evt) => debouncedSearch(evt.target.value)}
                          defaultValue={searchParamsObj.sample}
                          ref={searchRef}
                        />
                        {searchParamsObj.sample && (
                          <Button onClick={() => clearSearch()}>
                            <X />
                          </Button>
                        )}
                        <Form.Control
                          as="select"
                          defaultValue={selectedSample}
                          onChange={(event) =>
                            selectSample(parseInt(event.target.value))
                          }
                        >
                          {samples.results.map((sample) => (
                            <option
                              key={sample.blSampleId}
                              value={sample.blSampleId}
                            >
                              {sample.name}
                            </option>
                          ))}
                          {samples.total > samples.limit && (
                            <option disabled>...</option>
                          )}
                        </Form.Control>
                      </>
                    }
                  />
                </Suspense>
              ) : null}
            </Col>
            <Col sm={3}>
              <SubSamplePanel
                blSampleId={selectedSample}
                selectedSubSample={selectedSubSample}
                setSelectedSubSample={setSelectedSubSample}
              />
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default function SampleReview() {
  return (
    <Suspense fallback={<span>Loading Samples</span>}>
      <SampleReviewMain />
    </Suspense>
  );
}
