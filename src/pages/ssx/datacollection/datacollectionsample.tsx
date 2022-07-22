import { getDataCollectionSampleThumbnail } from 'api/pyispyb';
import { ZoomImageBearer } from 'components/image/zoomimage';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { useSSXDataCollectionSample } from 'hooks/pyispyb';
import { Col, Row } from 'react-bootstrap';
import { SSXDataCollectionResponse } from '../model';

export default function SSXDataCollectionSample({ dc }: { dc: SSXDataCollectionResponse }) {
  const { data: sample, isError } = useSSXDataCollectionSample(dc.ssxDataCollectionId);

  const ligand = sample?.Specimen.Structures.filter((v) => v.structureType == 'Ligand')[0];

  if (isError) throw Error(isError);
  return (
    <Row>
      <Col>
        <SimpleParameterTable
          parameters={[
            { key: 'Sample name', value: sample?.Specimen.Macromolecule.name },
            { key: 'Protein', value: sample?.Specimen.Macromolecule.acronym },
            { key: 'Avg crystal size', value: sample?.avgXtalSize },
            { key: 'Crystal concentration', value: sample?.Specimen.concentration },
            { key: 'Support', value: sample?.sampleSupport },
          ]}
        ></SimpleParameterTable>
      </Col>
      <Col>
        <div style={{ textAlign: 'center' }}>TODO: Preparation </div>
      </Col>
      <Col>
        <div style={{ textAlign: 'center' }}>TODO: Crystal form </div>
      </Col>
      <Col>
        <SimpleParameterTable
          parameters={[
            { key: 'Ligand', value: ligand?.name },
            { key: 'Buffer', value: sample?.Specimen.Buffer.name },
            { key: 'Buffer concentration', value: sample?.Specimen.Buffer.composition },
          ]}
        ></SimpleParameterTable>
      </Col>
      <Col xs={12} sm={6} md={true}>
        <ZoomImageBearer alt="Sample snapshot" src={getDataCollectionSampleThumbnail({ dataCollectionId: dc.DataCollection.dataCollectionId, thumbnailNumber: 1 })} />
      </Col>
    </Row>
  );
}
