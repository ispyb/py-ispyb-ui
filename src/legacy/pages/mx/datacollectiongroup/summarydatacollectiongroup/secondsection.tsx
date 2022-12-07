import React from 'react';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import {
  convertToFixed,
  wavelengthToEnergy,
  convertToExponential,
} from 'legacy/helpers/numerictransformation';

export default function SecondSection({
  dataCollectionGroup,
  compact = false,
}: {
  dataCollectionGroup: DataCollectionGroup;
  compact?: boolean;
}) {
  const {
    DataCollection_axisStart = 0,
    DataCollection_axisEnd = 0,
    DataCollection_resolution,
    DataCollection_resolutionAtCorner,
    DataCollection_wavelength,
    DataCollection_rotationAxis,
    DataCollection_axisRange,
    DataCollection_exposureTime,
    DataCollection_flux,
    DataCollection_flux_end,
  } = dataCollectionGroup;
  const axisRange = DataCollection_axisEnd - DataCollection_axisStart;

  const parameters = compact
    ? [
        {
          key: 'Res. (corner)',
          value: `${convertToFixed(
            DataCollection_resolution,
            2
          )}  Å (${convertToFixed(DataCollection_resolutionAtCorner, 2)}  Å )`,
        },

        {
          key: 'En. (Wave.)',
          value: `${convertToFixed(
            wavelengthToEnergy(DataCollection_wavelength),
            3
          )}  KeV (${convertToFixed(DataCollection_wavelength, 4)} )`,
        },
      ]
    : [
        {
          key: 'Res. (corner)',
          value: `${convertToFixed(
            DataCollection_resolution,
            2
          )}  Å (${convertToFixed(DataCollection_resolutionAtCorner, 2)}  Å )`,
        },

        {
          key: 'En. (Wave.)',
          value: `${convertToFixed(
            wavelengthToEnergy(DataCollection_wavelength),
            3
          )}  KeV (${convertToFixed(DataCollection_wavelength, 4)} )`,
        },

        {
          key: `${DataCollection_rotationAxis} range`,
          value: `${convertToFixed(DataCollection_axisRange, 2)}`,
          units: '°',
        },
        {
          key: `${DataCollection_rotationAxis} start (total)`,
          value: `${convertToFixed(
            DataCollection_axisStart,
            2
          )} ° (${convertToFixed(axisRange, 2)})`,
        },
        {
          key: 'Exposure Time',
          value: DataCollection_exposureTime,
          units: 's',
        },
        {
          key: 'Flux start',
          value: convertToExponential(DataCollection_flux, 2),
          units: 'ph/sec',
        },
        {
          key: 'Flux end',
          value: convertToExponential(DataCollection_flux_end, 2),
          units: 'ph/sec',
        },
      ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
