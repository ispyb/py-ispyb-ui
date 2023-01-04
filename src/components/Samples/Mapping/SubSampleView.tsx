import { useSuspense } from 'rest-hooks';
import { MapResource } from 'api/resources/Map';

import Table from 'components/Layout/Table';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

export default function SubSampleView({
  blSubSampleId,
}: {
  blSubSampleId: number;
}) {
  const maps = useSuspense(MapResource.list(), { blSubSampleId });
  return (
    <>
      <h1>SubSample: {blSubSampleId}</h1>
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
            formatter: (row) =>
              row.XRFFluorescenceMappingROI.scalar
                ? row.XRFFluorescenceMappingROI.scalar
                : `${row.XRFFluorescenceMappingROI.edge}-${row.XRFFluorescenceMappingROI.element}`,
            className: 'text-nowrap',
          },
          {
            label: 'Visible',
            key: 'opacity',
            className: 'text-nowrap text-right',
            formatter: (row) => (row.opacity ? <Eye /> : <EyeSlash />),
          },
        ]}
        emptyText="No maps yet"
      />
    </>
  );
}
