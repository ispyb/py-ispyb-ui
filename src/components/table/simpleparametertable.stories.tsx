import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';

interface Parameter {
  key: string;
  value: string;
}

interface Props {
  parameters: Parameter[];
}

export default function SimpleParameterTable({ parameters }: Props): JSX.Element {
  return (
    <Table>
      <tbody>
        {parameters.map((parameter) => {
          {
            return (
              <Row>
                <Col xs={5} md={5} className="parameterKey">
                  {parameter.key}
                </Col>
                <Col xs={7} md={7} className="parameterValue">
                  {parameter.value}
                </Col>
              </Row>
            );
          }
        })}
      </tbody>
    </Table>
  );
}
