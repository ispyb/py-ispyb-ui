import { useRef, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import {
  useNavigate,
  createSearchParams,
  useSearchParams,
} from 'react-router-dom';

interface Props {
  total: number;
  skip: number;
  limit: number;
  suffix?: string;
}

export default function Paginator(props: Props) {
  const { total, skip, limit, suffix } = props;
  const skipParam = suffix ? `skip-${suffix}` : 'skip';
  const limitParam = suffix ? `limit-${suffix}` : 'limit';
  const limitRef = useRef<any>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // @ts-ignore
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const searchLimit = searchParamsObj[limitParam];

  const nPages = Math.ceil(total / limit);
  const currentPage = skip / limit + 1;
  const nPagesShown = nPages > 3 ? 3 : nPages;
  const nPageStart =
    currentPage === 1
      ? currentPage
      : currentPage > nPages - 2
      ? nPages - 2
      : currentPage - 1;
  useEffect(() => {
    if (limitRef.current) {
      limitRef.current.value = searchLimit;
    }
  }, [searchLimit]);

  const gotoPage = (page: number) => {
    const newSkip = limit * (page - 1);
    const newParams = {
      ...searchParamsObj,
    };
    newParams[skipParam] = newSkip.toString();
    newParams[limitParam] = limit.toString();
    navigate({
      pathname: '',
      search: createSearchParams(newParams).toString(),
    });
  };

  const changeLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newParams = {
      ...searchParamsObj,
    };
    newParams[limitParam] = e.target.value;
    navigate({
      pathname: '',
      search: createSearchParams(newParams).toString(),
    });
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
      <Col>
        <Form.Control
          ref={limitRef}
          as="select"
          onChange={changeLimit}
          defaultValue={searchParamsObj[limitParam] || limit}
        >
          {[5, 10, 25].map((i) => (
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
