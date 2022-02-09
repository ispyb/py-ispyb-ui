import React, { PropsWithChildren } from 'react';
import Page from 'pages/page';
import SessionTabMenu from 'pages/em/sessiontabmenu';

type Props = PropsWithChildren<{
  sessionId: string | undefined;
  proposalName: string | undefined;
}>;

export default function EMPage({ children, sessionId, proposalName }: Props) {
  return (
    <Page>
      <SessionTabMenu sessionId={sessionId} proposalName={proposalName}></SessionTabMenu>
      {children}
    </Page>
  );
}
