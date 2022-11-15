import { faFlask, faVial } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sample } from 'models/Sample';
import { Col, Table } from 'react-bootstrap';

export function SamplePreparation({ sample }: { sample?: Sample }) {
  if (!sample) {
    return <p>Could not find sample information.</p>;
  }
  return (
    <Col>
      {sample.Crystal.crystal_compositions?.length ? (
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
              <th>pH</th>
            </tr>
          </thead>
          <tbody>
            {sample.Crystal.crystal_compositions &&
              sample.Crystal.crystal_compositions
                .sort((a, b) => a.Component.ComponentType.name.localeCompare(b.Component.ComponentType.name))
                .map((composition) => {
                  return (
                    <tr key={composition.Component.name}>
                      <th>{componentTypeDisplayValue(composition.Component.ComponentType.name)}</th>

                      <td>{composition.Component.name}</td>
                      <td>{composition.abundance}</td>
                      <td>{composition.Component.composition}</td>
                      <td>{composition.ph}</td>
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
            <th>pH</th>
          </tr>
        </thead>
        <tbody>
          {sample.sample_compositions &&
            sample.sample_compositions
              .sort((a, b) => a.Component.ComponentType.name.localeCompare(b.Component.ComponentType.name))
              .map((composition) => {
                return (
                  <tr key={composition.Component.name}>
                    <th>{componentTypeDisplayValue(composition.Component.ComponentType.name)}</th>

                    <td>{composition.Component.name}</td>
                    <td>{composition.abundance}</td>
                    <td>{composition.Component.composition}</td>
                    <td>{composition.ph}</td>
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
