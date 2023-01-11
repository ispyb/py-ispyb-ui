import { useSuspense } from 'rest-hooks';
import classNames from 'classnames';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

import { MapResource } from 'api/resources/Map';
import Table from 'components/Layout/Table';
import { getROIName } from './Maps';

export default function SubSampleView({
  blSubSampleId,
}: {
  blSubSampleId: number;
}) {
  const maps = useSuspense(MapResource.list(), { blSubSampleId });
  return (
    <Table
      keyId="xrfFluorescenceMappingId"
      results={maps.results}
      paginator={{
        total: maps.total,
        skip: maps.skip,
        limit: maps.limit,
      }}
      columns={[
        {
          label: 'ID',
          key: 'xrfFluorescenceMappingId',
          className: 'text-break',
        },
        {
          label: 'ROI',
          key: 'XRFFluorescenceMappingROI.edge',
          formatter: (row) => getROIName(row),
          className: 'text-nowrap',
        },
        {
          label: 'Px',
          key: 'GridInfo.steps_x',
          className: 'text-nowrap',
        },
        {
          label: 'Py',
          key: 'GridInfo.steps_y',
          className: 'text-nowrap',
        },
        {
          label: '',
          key: 'opacity',
          className: 'text-nowrap text-end',
          formatter: (row) => (
            <div
              className={classNames(
                'btn',
                'btn-sm',
                { 'btn-primary': row.opacity },
                { 'btn-light': !row.opacity }
              )}
            >
              {row.opacity ? <Eye /> : <EyeSlash />}
            </div>
          ),
        },
      ]}
      emptyText="No maps yet"
    />
  );
}
