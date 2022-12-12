import React from 'react';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { multiply } from 'legacy/helpers/numerictransformation';

export default function FifthSection({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  const {
    beamSizeAtSampleX,
    beamSizeAtSampleY,
    BeamLineSetup_beamDivergenceHorizontal,
    BeamLineSetup_beamDivergenceVertical,
    BeamLineSetup_focusingOptic,
    BeamLineSetup_monochromatorType,
    DataCollection_beamShape,
    BeamLineSetup_polarisation,
  } = dataCollectionGroup;

  return (
    <SimpleParameterTable
      parameters={[
        {
          key: 'Focusing optics',
          value: BeamLineSetup_focusingOptic,
        },
        {
          key: 'Monochromator type',
          value: BeamLineSetup_monochromatorType,
        },
        {
          key: 'Beam shape',
          value: DataCollection_beamShape,
        },
        {
          key: 'Beam size at Sample Hor (Vert)',
          value: `${multiply(beamSizeAtSampleX, 1000)}(${multiply(
            beamSizeAtSampleY,
            1000
          )})`,
          units: 'μm',
        },
        {
          key: 'Beam divergence Hor (Vert)',
          value: `${BeamLineSetup_beamDivergenceHorizontal}(${BeamLineSetup_beamDivergenceVertical})`,
          units: 'μrad',
        },
        {
          key: 'Polarisation',
          value: BeamLineSetup_polarisation,
        },
      ]}
    ></SimpleParameterTable>
  );
}
