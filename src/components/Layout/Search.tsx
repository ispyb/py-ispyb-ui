import { usePersistentParamState } from 'hooks/useParam';
import { debounce } from 'lodash';
import { useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import {} from 'react-router-dom';

export default function Search({ focus }: { focus?: boolean }) {
  const [search, setSearch] = usePersistentParamState<string>('search', '');
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (focus) searchRef.current?.focus();
  }, [focus]);

  function doSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value || '');
  }

  function clear() {
    if (searchRef.current) searchRef.current.value = '';
    setSearch('');

    searchRef.current?.focus();
  }

  const debouncedDoSearch = debounce(doSearch, 500);

  return (
    <InputGroup>
      <Form.Control
        placeholder="Search"
        ref={searchRef}
        onChange={debouncedDoSearch}
        defaultValue={search}
      />
      {search && (
        <Button onClick={clear}>
          <X />
        </Button>
      )}
    </InputGroup>
  );
}
