import { faFlask } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDataCollectionSampleThumbnail } from 'api/pyispyb';
import { ZoomImageBearer } from 'components/image/zoomimage';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { useSSXDataCollectionSample } from 'hooks/pyispyb';
import { Col, Row, Table } from 'react-bootstrap';
import { SSXDataCollectionResponse, SSXSampleResponse } from '../model';

export default function SSXDataCollectionSample({ dc }: { dc: SSXDataCollectionResponse }) {
  const { data: sample, isError } = useSSXDataCollectionSample(dc.DataCollection.dataCollectionId);

  if (isError) throw Error(isError);
  return (
    <Row>
      <Col>
        <SimpleParameterTable
          parameters={[
            { key: 'Sample name', value: sample?.name },
            { key: 'Protein', value: sample?.Crystal.Protein.acronym },
            { key: 'Avg crystal size (X, Y, Z)', value: `${sample?.Crystal.size_X}, ${sample?.Crystal.size_Y}, ${sample?.Crystal.size_Z}` },
            { key: 'Crystal concentration', value: sample?.Crystal.abundance },
            { key: 'Support', value: 'TODO' },
          ]}
        ></SimpleParameterTable>
      </Col>
      <Col>
        <SamplePreparation sample={sample}></SamplePreparation>
      </Col>
      <Col md={'auto'}>
        <ZoomImageBearer
          style={{ maxWidth: 300 }}
          alt="Sample snapshot"
          src={getDataCollectionSampleThumbnail({ dataCollectionId: dc.DataCollection.dataCollectionId, thumbnailNumber: 1 })}
        />
      </Col>
    </Row>
  );
}

export function SamplePreparation({ sample }: { sample?: SSXSampleResponse }) {
  if (!sample) {
    return <p>Could not find sample information.</p>;
  }
  return (
    <Table size="sm" striped bordered hover style={{ margin: 10 }}>
      <thead>
        <tr>
          <th>
            <h5>
              <FontAwesomeIcon icon={faFlask} style={{ marginRight: 10 }} />
              Sample components
            </h5>
          </th>
          <th>Name</th>
          <th>Concentration</th>
          <th>Composition</th>
        </tr>
      </thead>
      <tbody>
        {sample.sample_components
          .sort((a, b) => a.componentType.localeCompare(b.componentType))
          .map((component) => {
            return (
              <tr>
                <th>{componentTypeDisplayValue(component.componentType)}</th>
                <td>{component.name}</td>
                <td>{component.concentration}</td>
                <td>{component.composition}</td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
}

function componentTypeDisplayValue(componentType: string) {
  if (componentType == 'JetMaterial') return 'Jet material';
  return componentType;
}
