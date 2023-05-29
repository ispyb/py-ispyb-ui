import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

export function HelpIcon({
  message,
  size = '1x',
  style,
}: {
  message: string | string[];
  size?: SizeProp;
  style?: React.CSSProperties;
}) {
  return (
    <OverlayTrigger
      placement="auto"
      trigger={['hover', 'focus']}
      overlay={
        <Tooltip>
          <div style={{ textAlign: 'left' }}>
            {message instanceof Array
              ? message.map((line) => (
                  <div key={line}>
                    {line}
                    <br />
                  </div>
                ))
              : message}
          </div>
        </Tooltip>
      }
    >
      <FontAwesomeIcon
        size={size}
        style={style}
        color="gray"
        icon={faQuestionCircle}
      />
    </OverlayTrigger>
  );
}

export function HelpIconCol({
  message,
  size = '1x',
}: {
  message: string | string[];
  size?: SizeProp;
}) {
  return (
    <Col xs={'auto'} style={{ display: 'flex', padding: 0 }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'center',
        }}
      >
        <HelpIcon message={message} size={size} />
      </div>
    </Col>
  );
}
