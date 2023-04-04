import { Alert } from 'react-bootstrap';
import { DataCollectionGroup, EnergyScan, FluorescenceSpectra } from '../model';
import { DataCollectionGroupPanel } from './datacollectiongroup/DataCollectionGroupPanel';
import EnergyScanPanel from './energyscan/energyscanpanel';
import FluorescencePanel from './fluorescence/fluorescencepanel';

export function AcquisitionPanel({
  acquisition,
  proposalName,
  sessionId,
}: {
  acquisition: DataCollectionGroup | FluorescenceSpectra | EnergyScan;
  proposalName: string;
  sessionId: string;
}) {
  if ('DataCollectionGroup_dataCollectionGroupId' in acquisition) {
    if (acquisition.DataCollection_dataCollectionId === undefined) return null; // Ignore empty groups
    return (
      <div style={{ margin: 5 }}>
        <DataCollectionGroupPanel
          dataCollectionGroup={acquisition}
          proposalName={proposalName}
          sessionId={sessionId}
        ></DataCollectionGroupPanel>
      </div>
    );
  } else if ('xfeFluorescenceSpectrumId' in acquisition) {
    return (
      <div style={{ margin: 5 }}>
        <FluorescencePanel
          spectra={acquisition}
          proposalName={proposalName}
          sessionId={sessionId}
        ></FluorescencePanel>
      </div>
    );
  } else if ('energyScanId' in acquisition) {
    return (
      <div style={{ margin: 5 }}>
        <EnergyScanPanel
          energyScan={acquisition}
          proposalName={proposalName}
          sessionId={sessionId}
        ></EnergyScanPanel>
      </div>
    );
  } else {
    return (
      <div style={{ margin: 5 }}>
        <Alert variant="danger">Unknown acquisition type</Alert>
      </div>
    );
  }
}
