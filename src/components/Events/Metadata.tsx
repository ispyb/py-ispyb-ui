import classNames from 'classnames';
import { Container, Row, Col, Popover, OverlayTrigger } from 'react-bootstrap';

export interface IMetadataItemProps {
  title: string;
  content: any;
  test?: any;
  unit?: string;
  truncate?: boolean;
}

export interface IMetadataProps {
  properties: Array<IMetadataItemProps>;
  truncate?: boolean;
}

export default function Metadata(props: IMetadataProps) {
  return (
    <Container className="g-0">
      <Row className="metadata-list g-1 me-2">
        {props.properties
          .filter((item) => item.test === undefined || item.test)
          .map((item) => (
            <Col key={item.title} sm={6}>
              <MetadataItem
                key={item.title}
                {...item}
                truncate={
                  item.truncate !== undefined ? item.truncate : props.truncate
                }
              />
            </Col>
          ))}
      </Row>
    </Container>
  );
}

export function MetadataCol(props: IMetadataProps) {
  return (
    <Col className="metadata-list  g-0">
      {props.properties
        .filter((item) => item.test === undefined || item.test)
        .map((item) => (
          <Row key={item.title} className="g-0">
            <Col className="g-0">
              <MetadataItem
                {...item}
                truncate={
                  item.truncate !== undefined ? item.truncate : props.truncate
                }
              />
            </Col>
          </Row>
        ))}
    </Col>
  );
}

export function MetadataRow(props: { auto?: boolean } & IMetadataProps) {
  return (
    <Row className="metadata-list  g-1">
      {props.properties
        .filter((item) => item.test === undefined || item.test)
        .map((item) => (
          <Col key={item.title} md={props.auto ? 'auto' : undefined}>
            <MetadataItem
              {...item}
              truncate={
                item.truncate !== undefined ? item.truncate : props.truncate
              }
            />
          </Col>
        ))}
    </Row>
  );
}

export function MetadataItem(props: IMetadataItemProps) {
  const popover = (
    <Popover className="metadata-popover">
      <Popover.Header as="h3">{props.title}</Popover.Header>
      <Popover.Body>
        {props.content} <span className="text-primary">{props.unit}</span>
      </Popover.Body>
    </Popover>
  );

  const elem = (
    <div
      style={{
        color: 'black',
      }}
      className={classNames({
        'mb-1': true,
        'p-2': true,
        'bg-light': true,
        'text-truncate': props.truncate !== false,
      })}
    >
      <span className="text-primary">{props.title}</span>: {props.content}{' '}
      <span className="text-primary">{props.unit}</span>
    </div>
  );
  if (props.truncate !== false)
    return (
      <>
        {(props.test === undefined || props.test) && (
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="auto"
            overlay={popover}
          >
            {elem}
          </OverlayTrigger>
        )}
      </>
    );
  return elem;
}
