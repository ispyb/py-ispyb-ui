import React, { PropsWithChildren } from 'react';
import SessionTabMenu from 'legacy/pages/em/sessiontabmenu';

type Props = PropsWithChildren<{
  sessionId: string | undefined;
  proposalName: string | undefined;
}>;

export default function EMPage({ children, sessionId, proposalName }: Props) {
  return (
    <>
      <SessionTabMenu
        sessionId={sessionId}
        proposalName={proposalName}
      ></SessionTabMenu>
      {children}
    </>
  );
}
