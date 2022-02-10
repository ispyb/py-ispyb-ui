import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { DataCollection } from 'pages/mx/model';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { convertToFixed, wavelengthToEnergy, convertToExponential } from 'helpers/numerictransformation';
import { getDiffrationThumbnail, getCrystalImage, getDozorPlot } from 'api/ispyb';
import ZoomImage from 'components/image/zoomimage';

type Props = {
  sessionId: string;
  proposalName: string;
  dataCollection: DataCollection;
};

const SummaryDataCollectionGroupPanel = ({ proposalName, dataCollection }: { proposalName: string; dataCollection: DataCollection }) => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <SimpleParameterTable
            parameters={[
              { key: 'Workflow', value: dataCollection.Workflow_workflowType },
              { key: 'Protein', value: dataCollection.Protein_acronym },
              { key: 'Sample', value: dataCollection.BLSample_name },
              { key: 'Prefix', value: dataCollection.DataCollection_imagePrefix },
              { key: 'Run', value: '?' },
              { key: '# Images (Total)', value: `${dataCollection.DataCollection_numberOfImages} (${dataCollection.totalNumberOfImages})` },
              { key: 'Transmission', value: dataCollection.transmission, units: '%' },
            ]}
          ></SimpleParameterTable>
        </Col>
        <Col>
          <SimpleParameterTable
            parameters={[
              {
                key: 'Res. (corner)',
                value: `${convertToFixed(dataCollection.DataCollection_resolution, 2)}  Å (${convertToFixed(dataCollection.DataCollection_resolutionAtCorner, 2)}  Å )`,
              },

              {
                key: 'En. (Wave.)',
                value: `${convertToFixed(wavelengthToEnergy(dataCollection.DataCollection_wavelength), 3)}  KeV (${convertToFixed(dataCollection.DataCollection_wavelength, 4)} )`,
              },

              { key: `${dataCollection.DataCollection_rotationAxis} range`, value: `${convertToFixed(dataCollection.DataCollection_axisRange, 2)}`, units: '°' },
              {
                key: `${dataCollection.DataCollection_rotationAxis} start (total)`,
                value: `${convertToFixed(dataCollection.DataCollection_axisStart, 2)} ° (${convertToFixed(
                  dataCollection.DataCollection_axisEnd - dataCollection.DataCollection_axisStart,
                  2
                )})`,
              },
              { key: 'Exposure Time', value: dataCollection.DataCollection_exposureTime, units: 's' },
              { key: 'Flux start', value: convertToExponential(dataCollection.DataCollection_flux), units: 'ph/sec' },
              { key: 'Flux end', value: convertToExponential(dataCollection.DataCollection_flux_end), units: 'ph/sec' },
            ]}
          ></SimpleParameterTable>
        </Col>
        <Col></Col>
        <Col>
          <ZoomImage alt="Diffraction" src={getDiffrationThumbnail({ proposalName, imageId: dataCollection.firstImageId }).url}></ZoomImage>
        </Col>
        <Col>
          <ZoomImage alt="Crystal" src={getCrystalImage({ proposalName, dataCollectionId: dataCollection.DataCollection_dataCollectionId, imageIndex: 1 }).url}></ZoomImage>
        </Col>
        <Col>
          <ZoomImage alt="Dozor" src={getDozorPlot({ proposalName, dataCollectionId: dataCollection.DataCollection_dataCollectionId }).url}></ZoomImage>
        </Col>
      </Row>
    </Container>
  );
};

export default function DataCollectionGroupPanel({ proposalName, dataCollection }: Props) {
  return (
    <Card>
      <SummaryDataCollectionGroupPanel proposalName={proposalName} dataCollection={dataCollection}></SummaryDataCollectionGroupPanel>
    </Card>
  );
}
