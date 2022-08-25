import { faFlask, faVial } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { useSSXDataCollectionGroupSample } from 'hooks/pyispyb';
import { Col, Row, Table } from 'react-bootstrap';
import { DataCollectionGroupResponse, SSXSampleResponse } from '../model';

export default function SSXDataCollectionGroupSample({ dcg }: { dcg: DataCollectionGroupResponse }) {
  const { data: sample, isError } = useSSXDataCollectionGroupSample(dcg.dataCollectionGroupId);

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
      <Col style={{ marginRight: 20 }}>
        <SamplePreparation sample={sample}></SamplePreparation>
      </Col>
    </Row>
  );
}

export function SamplePreparation({ sample }: { sample?: SSXSampleResponse }) {
  if (!sample) {
    return <p>Could not find sample information.</p>;
  }
  return (
    <Col>
      {sample.Crystal.crystal_compositions.length ? (
        <Table size="sm" striped bordered hover style={{ margin: 10 }}>
          <thead>
            <tr>
              <th>
                <h5>
                  <FontAwesomeIcon icon={faVial} style={{ marginRight: 10 }} />
                  Crystal components
                </h5>
              </th>
              <th>Name</th>
              <th>Concentration</th>
              <th>Composition</th>
            </tr>
          </thead>
          <tbody>
            {sample.Crystal.crystal_compositions
              .sort((a, b) => a.Component.ComponentType.name.localeCompare(b.Component.ComponentType.name))
              .map((composition) => {
                return (
                  <tr>
                    <th>{componentTypeDisplayValue(composition.Component.ComponentType.name)}</th>

                    <td>{composition.Component.name}</td>
                    <td>{composition.abundance}</td>
                    <td>{composition.Component.composition}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      ) : (
        <></>
      )}
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
          {sample.sample_compositions
            .sort((a, b) => a.Component.ComponentType.name.localeCompare(b.Component.ComponentType.name))
            .map((composition) => {
              return (
                <tr>
                  <th>{componentTypeDisplayValue(composition.Component.ComponentType.name)}</th>

                  <td>{composition.Component.name}</td>
                  <td>{composition.abundance}</td>
                  <td>{composition.Component.composition}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Col>
  );
}

function componentTypeDisplayValue(componentType: string) {
  if (componentType == 'JetMaterial') return 'Jet material';
  return componentType;
}
