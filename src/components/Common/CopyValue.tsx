import {
  faClipboard,
  faClipboardCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { OverlayTrigger, Tooltip, Card } from 'react-bootstrap';

export function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 5000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [copied]);

  return (
    <OverlayTrigger
      placement="auto"
      overlay={<Tooltip>{copied ? 'Copied' : 'Copy to clipboard'}</Tooltip>}
    >
      <Card
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(value);
          setCopied(true);
        }}
        style={{
          padding: 5,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexDirection: 'row',
          cursor: 'pointer',
        }}
      >
        <FontAwesomeIcon
          size="lg"
          icon={copied ? faClipboardCheck : faClipboard}
        />
        <span
          style={{
            overflow: 'hidden',
            overflowWrap: 'break-word',
          }}
        >
          {value}
        </span>
      </Card>
    </OverlayTrigger>
  );
}
