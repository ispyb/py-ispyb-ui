import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { DataCollection as DataCollectionType, Event } from 'models/Event.d';
import Metadata from 'components/Events/Metadata';
import PerImageAnalysis from 'components/Events/PerImageAnalysis';
import Snapshot from 'components/Events/DataCollections/Snapshot';
import { ProcessingStatuses } from 'models/ProcessingStatusesList.d';
import { AutoProcProgramMessageStatus } from 'models/AutoProcProgramMessageStatuses.d';
import { DataCollectionBox } from 'components/Events/DataCollection';
import DataCollectionAttachmentPlot from '../DataCollectionAttachmentPlot';
import { toEnergy } from 'utils/numbers';

export interface IDataCollection {
  item: DataCollectionType;
  parent: Event;
  isGroup: boolean;
  processingStatuses?: ProcessingStatuses;
  messageStatuses?: AutoProcProgramMessageStatus;
}

export default function EnergyScan(props: IDataCollection) {
  const { parent, item } = props;
  const res = (
    <Row className="g-0">
      <Col md="4">
        <Metadata
          properties={[
            {
              title: 'Sample',
              test: parent.blSample,
              content: (
                <Link
                  to={`/proposals/${parent.proposal}/samples/${parent.blSampleId}`}
                >
                  {parent.blSample}
                </Link>
              ),
            },
            {
              title: 'Type',
              content: item.DataCollectionGroup.experimentType,
            },
            { title: 'Status', content: item.runStatus },
            {
              title: 'Duration',
              content: parent.duration ? Math.round(parent.duration) : 0,
              unit: 'min',
            },
            {
              title: 'Start Energy',
              content: item.wavelength && toEnergy(item.wavelength),
              unit: 'keV',
            },
            { title: 'No. Points', content: item.numberOfImages },
            {
              title: 'Exposure Time',
              content: item.exposureTime,
              unit: 's',
            },
            {
              title: 'Beamsize',
              content: `${item.beamSizeAtSampleX} x ${item.beamSizeAtSampleY}`,
              unit: 'µm',
            },
            { title: 'No. Repeats', content: item.numberOfPasses },
          ]}
        />
      </Col>
      <Col
        className="text-center bg-light"
        xs="12"
        md="2"
        style={{ overflow: 'hidden', height: 250 }}
      >
        <Snapshot item={item} />
      </Col>
      <Col className="text-center bg-light" xs="12" md="3">
        <DataCollectionAttachmentPlot
          dataCollectionId={item.dataCollectionId}
          xAxisTitle="Energy (keV)"
          yAxisTitle="Counts"
        />
      </Col>
      <Col className="text-center bg-light" xs="12" md="3">
        <PerImageAnalysis
          dataCollectionId={item.dataCollectionId}
          endTime={parent.endTime}
          xAxisTitle="Repeat"
          yAxisTitle="Counts"
        />
      </Col>
    </Row>
  );

  return <DataCollectionBox {...props}>{res}</DataCollectionBox>;
}
