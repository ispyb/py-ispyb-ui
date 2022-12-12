import React from 'react';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { multiply } from 'legacy/helpers/numerictransformation';

export default function SixthSection({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  const {
    Detector_detectorPixelSizeHorizontal,
    Detector_detectorPixelSizeVertical,
    Detector_detectorType,
    Detector_detectorModel,
    Detector_detectorManufacturer,
  } = dataCollectionGroup;

  return (
    <SimpleParameterTable
      parameters={[
        {
          key: 'Detector Type',
          value: Detector_detectorType,
        },
        {
          key: 'Detector Model',
          value: Detector_detectorModel,
        },
        {
          key: 'Manufacturer',
          value: Detector_detectorManufacturer,
        },
        {
          key: 'Pixel Size Hor (Vert)',
          value: `${multiply(
            Detector_detectorPixelSizeHorizontal,
            1000
          )}(${multiply(Detector_detectorPixelSizeVertical, 1000)})`,
          units: 'μm',
        },
      ]}
    ></SimpleParameterTable>
  );
}
