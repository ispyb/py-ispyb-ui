import { Suspense, useState, useEffect } from 'react';
import { useSuspense } from 'rest-hooks';
import { Container, Row, Col, Form } from 'react-bootstrap';

import { useProposal } from 'hooks/useProposal';
import { SampleResource } from 'api/resources/Sample';

import SubSampleList from './SubSampleList';
import SubSampleView from './SubSampleView';
import SampleCanvas from './SampleCanvas';
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from 'react-router-dom';

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

export default function SampleReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // @ts-ignore
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const [canvasMounted, setCanvasMount] = useState<boolean>(true);
  const proposal = useProposal();
  const samples = useSuspense(SampleResource.list(), {
    proposal: proposal.proposalName,
  });
  const [selectedSample, setSelectedSample] = useState<number | undefined>(
    searchParamsObj.blSampleId
      ? parseInt(searchParamsObj.blSampleId)
      : samples.results.length
      ? samples.results[0].blSampleId
      : undefined
  );
  const [selectedSubSample, setSelectedSubSample] = useState<number>();

  useEffect(() => {
    setSelectedSubSample(undefined);
  }, [selectedSample]);

  console.log('SampleReviewMain render', selectedSample);

  function selectSample(blSampleId: number) {
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
  }

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
                      </Form.Control>
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
