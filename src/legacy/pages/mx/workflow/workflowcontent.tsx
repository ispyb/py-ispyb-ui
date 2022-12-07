import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ZoomImage from 'legacy/components/image/zoomimage';
import { MouseEventHandler } from 'react';
import { Alert, Button, Col, Container, Row, Table } from 'react-bootstrap';
import { WorkflowStep, WorkflowStepItem } from '../model';

export default function WorkflowContent({ step }: { step: WorkflowStep }) {
  return (
    <Container fluid style={{ padding: 30 }}>
      <Col>
        {step.items.map((item) => {
          switch (item.type) {
            case 'table':
              return <TableContent item={item}></TableContent>;
            case 'warning':
              return <WarningContent item={item}></WarningContent>;
            case 'info':
              return <InfoContent item={item}></InfoContent>;
            case 'images':
              return <ImagesContent item={item}></ImagesContent>;
            case 'logFile':
              return <LogFileContent item={item}></LogFileContent>;
            default:
              return null;
          }
        })}
      </Col>
    </Container>
  );
}

export function WarningContent({ item }: { item: WorkflowStepItem }) {
  return (
    <Row style={{ marginLeft: 0 }}>
      <Alert variant="warning">{item.value}</Alert>
    </Row>
  );
}

export function InfoContent({ item }: { item: WorkflowStepItem }) {
  return (
    <Row style={{ marginLeft: 0 }}>
      <Alert variant="info">{item.value}</Alert>
    </Row>
  );
}

export function TableContent({ item }: { item: WorkflowStepItem }) {
  return (
    <Row>
      <h5>{item.title}</h5>
      <Table responsive striped bordered hover size="sm">
        <thead>
          <tr>
            {item.columns?.map((column) => {
              return <th>{column}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {item.data?.map((row) => {
            return (
              <tr>
                {row?.map((value) => {
                  return <td>{value}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Row>
  );
}

export function ImagesContent({ item }: { item: WorkflowStepItem }) {
  return (
    <Row>
      <Table responsive>
        <tr>
          {item.items?.map((value) => {
            const src = 'data:image/png;base64,' + value.value;
            return (
              <td>
                <ZoomImage
                  style={{ maxWidth: 500 }}
                  lazy={false}
                  src={src}
                  legend={value.title}
                ></ZoomImage>
              </td>
            );
          })}
        </tr>
      </Table>
    </Row>
  );
}

export function LogFileContent({ item }: { item: WorkflowStepItem }) {
  return (
    <Button
      style={{ marginRight: 5, marginBottom: 15 }}
      variant="secondary"
      onClick={downloadHandlerFromValue(item.logText)}
    >
      <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon> {item.linkText}
    </Button>
  );
}

function downloadHandlerFromValue(
  value = ''
): MouseEventHandler<HTMLButtonElement> {
  return () => {
    const element = document.createElement('a');
    const file = new Blob([value], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'log.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
}
