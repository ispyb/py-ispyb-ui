import React from 'react';
import { DataCollectionGroup } from 'pages/mx/model';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { convertToFixed } from 'helpers/numerictransformation';

export default function FourthSection({ dataCollectionGroup }: { dataCollectionGroup: DataCollectionGroup }) {
  const { BeamLineSetup_synchrotronName, synchrotronCurrent, BeamLineSetup_synchrotronMode } = dataCollectionGroup;

  return (
    <SimpleParameterTable
      parameters={[
        {
          key: 'Synchrotron name',
          value: BeamLineSetup_synchrotronName,
        },
        {
          key: 'Synchrotron filling mode',
          value: BeamLineSetup_synchrotronMode,
        },
        {
          key: 'Synchrotron Current',
          value: `${convertToFixed(synchrotronCurrent?.split(',')[0], 1)}`,
        },
        {
          key: 'Undulator types',
          value: 'Not available',
        },
        {
          key: 'Undulator gaps',
          value: 'Not available',
        },
      ]}
    ></SimpleParameterTable>
  );
}
