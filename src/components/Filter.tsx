import classNames from 'classnames';
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
} from 'react-router-dom';

interface IFilterType {
  filterKey: string;
  filterValue: string;
}

interface IFilter {
  urlKey: string;
  filters: IFilterType[];
}

export default function Filter(props: IFilter) {
  const navigate = useNavigate();
  const { filters, urlKey } = props;
  const [searchParams] = useSearchParams();
  // @ts-ignore
  const searchParamsObj = Object.fromEntries([...searchParams]);

  function doFilter(value: string) {
    const { [urlKey]: currentValue, ...excludeKey } = searchParamsObj;
    navigate({
      pathname: '',
      search: createSearchParams({
        ...excludeKey,
        ...(value !== currentValue ? { [urlKey]: value } : null),
      }).toString(),
    });
  }

  return (
    <div className="filter my-1">
      {filters.map((filter) => (
        <div
          key={filter.filterValue}
          onClick={() => doFilter(filter.filterValue)}
          className={classNames('me-1', 'btn', 'btn-sm', {
            'btn-primary': filter.filterValue !== searchParamsObj[urlKey],
            'btn-secondary': filter.filterValue === searchParamsObj[urlKey],
          })}
        >
          {filter.filterKey}
        </div>
      ))}
    </div>
  );
}
