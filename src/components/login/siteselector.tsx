import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Site } from 'models';
import { RootState } from 'store';
import sites from 'config/sites';
import { setSite } from 'redux/actions/site';
import { useAppDispatch } from 'hooks';

function SiteSelector() {
  const dispatch = useAppDispatch();
  const site: Site = useSelector((state: RootState) => state.site);
  return (
    <DropdownButton style={{ margin: 20 }} variant="info" id="dropdown-item-button" title={site.name}>
      {sites.map((s) => {
        return (
          <Dropdown.Item
            id={s.name}
            as="button"
            onClick={(e) => {
              const id = (e.target as HTMLButtonElement).id;
              dispatch(setSite(sites.find((s) => s.name === id)));
            }}
          >
            {s.name}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
}

export default SiteSelector;
