import { debounce } from 'lodash';
import { useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from 'react-router-dom';

export default function Search({ focus }: { focus?: boolean }) {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  // @ts-ignore
  const searchParamsObj = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (focus) searchRef.current?.focus();
  }, [focus]);

  function doSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const { search, ...excludeSearch } = searchParamsObj;
    navigate({
      pathname: '',
      search: createSearchParams({
        ...excludeSearch,
        search: e.target.value,
      }).toString(),
    });
  }

  function clear() {
    if (searchRef.current) searchRef.current.value = '';
    const { search, ...excludeSearch } = searchParamsObj;
    navigate({
      pathname: '',
      search: createSearchParams({
        ...excludeSearch,
      }).toString(),
    });
    searchRef.current?.focus();
  }

  const debouncedDoSearch = debounce(doSearch, 500);

  return (
    <InputGroup>
      <Form.Control
        placeholder="Search"
        ref={searchRef}
        onChange={debouncedDoSearch}
        defaultValue={searchParamsObj.search}
      />
      {searchParamsObj.search && (
        <Button onClick={clear}>
          <X />
        </Button>
      )}
    </InputGroup>
  );
}
