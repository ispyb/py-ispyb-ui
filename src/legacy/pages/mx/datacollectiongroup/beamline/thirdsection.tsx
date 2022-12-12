import React from 'react';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { convertToFixed } from 'legacy/helpers/numerictransformation';

export default function ThirdSection({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  const {
    DataCollection_detectorDistance,
    DataCollection_xBeam,
    DataCollection_yBeam,
    DataCollection_kappaStart,
    DataCollection_phiStart,
  } = dataCollectionGroup;

  return (
    <SimpleParameterTable
      parameters={[
        {
          key: 'Beamline Name',
          value: 'Not available',
        },
        {
          key: 'Detector Distance',
          value: `${convertToFixed(DataCollection_detectorDistance, 2)}`,
          units: 'mm',
        },
        {
          key: 'X Beam',
          value: `${convertToFixed(DataCollection_xBeam, 2)}`,
          units: 'mm',
        },
        {
          key: 'Y Beam',
          value: `${convertToFixed(DataCollection_yBeam, 2)}`,
          units: 'mm',
        },
        {
          key: 'Kappa',
          value: DataCollection_kappaStart,
        },
        {
          key: 'Phi',
          value: DataCollection_phiStart,
        },
      ]}
    ></SimpleParameterTable>
  );
}
