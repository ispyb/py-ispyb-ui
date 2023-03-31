import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useMemo, useRef } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

export function resetHashScroll() {
  window.location.hash = '';
}

export function useHashScroll(value: string | number) {
  const hash = `#${value}`;
  const { hash: urlHash } = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  const isCurrent = useMemo(() => {
    return urlHash === hash;
  }, [urlHash, hash]);

  useEffect(() => {
    if (isCurrent) {
      ref.current?.scrollIntoView({
        behavior: 'instant' as any,
        block: 'center',
        inline: 'center',
      });
    }
  }, [isCurrent]);

  return {
    ref,
    hash,
    isCurrent,
  };
}

export function HashAnchorButton({ hash }: { hash: string }) {
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
      <Button
        type="button"
        variant={'secondary'}
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          window.location.hash = hash;
          navigator.clipboard.writeText(window.location.href);
          setCopied(true);
        }}
      >
        <FontAwesomeIcon size={'lg'} icon={faLink} />
      </Button>
    </OverlayTrigger>
  );
}
