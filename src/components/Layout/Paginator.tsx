import React from '@handsontable/react';
import { usePersistentParamState } from 'hooks/useParam';
import { useMemo } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

interface Props {
  total: number;
  skip: number;
  limit: number;
  suffix?: string;
}

export default function Paginator(props: Props) {
  const { total, skip: skipDefault, limit: limitDefault, suffix } = props;
  const skipParam = suffix ? `skip-${suffix}` : 'skip';
  const limitParam = suffix ? `limit-${suffix}` : 'limit';

  // @ts-ignore

  const [currentLimitValue, setCurrentLimitValue] = usePersistentParamState(
    limitParam,
    limitDefault.toString()
  );
  const limit = useMemo(
    () => parseFloat(currentLimitValue),
    [currentLimitValue]
  );
  const [currentSkipValue, setCurrentSkipValue] = usePersistentParamState(
    skipParam,
    skipDefault.toString()
  );
  const skip = useMemo(() => parseFloat(currentSkipValue), [currentSkipValue]);

  const nPages = Math.ceil(total / limit);
  const currentPage = skip / limit + 1;
  const nPagesShown = nPages > 3 ? 3 : nPages;
  const nPageStart =
    currentPage === 1
      ? currentPage
      : currentPage > nPages - 2
      ? nPages - 2
      : currentPage - 1;

  const gotoPage = (page: number) => {
    const newSkip = limit * (page - 1);
    setCurrentSkipValue(newSkip.toString());
  };

  const changeLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = e.target.value;
    setCurrentLimitValue(newLimit);
  };

  return (
    <Row className="my-2 align-items-center" xs="auto">
      <Col className="text-nowrap">
        <div
          style={{ cursor: 1 !== currentPage ? 'pointer' : '' }}
          key="page-first"
          className={
            (1 === currentPage ? 'bg-gray' : 'bg-secondary') +
            ' border d-inline-block p-2 px-3 me-2'
          }
          onClick={() => gotoPage(1)}
        >
          &laquo;
        </div>
        {Array(nPagesShown)
          .fill(nPageStart)
          .map((start, i) => {
            const page = start + i;
            return (
              <div
                style={{ cursor: page !== currentPage ? 'pointer' : '' }}
                key={`page-${page}`}
                className={
                  (page === currentPage
                    ? 'border-primary bg-light'
                    : 'bg-secondary') + ' border d-inline-block p-2 px-3 me-2'
                }
                onClick={() => gotoPage(page)}
              >
                {page}
              </div>
            );
          })}
        {nPages > 3 && currentPage < nPages - 2 && (
          <div
            key="page-last-number"
            className="border d-inline-block p-2 px-3 me-2"
          >
            ... {nPages}
          </div>
        )}
        <div
          style={{ cursor: nPages !== currentPage ? 'pointer' : '' }}
          key="page-last"
          className={
            (nPages === currentPage ? 'bg-gray' : 'bg-secondary') +
            ' border d-inline-block p-2 px-3 me-2'
          }
          onClick={() => gotoPage(nPages)}
        >
          &raquo;
        </div>
      </Col>
      <Col
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span>Show:</span>
        <Form.Control
          as="select"
          onChange={changeLimit}
          value={currentLimitValue}
        >
          {[5, 10, 25, 50, 100].map((i) => (
            <option key={`limit-${i}`} value={i}>
              {i}
            </option>
          ))}
        </Form.Control>
      </Col>
      <Col>Total:</Col>
      <Col>{total}</Col>
    </Row>
  );
}
