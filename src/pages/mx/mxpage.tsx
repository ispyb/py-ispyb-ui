import React, { PropsWithChildren } from 'react';
import Page from 'pages/page';
import SessionTabMenu from 'pages/mx/sessiontabmenu';

type Props = PropsWithChildren<{
  sessionId: string | undefined;
  proposalName: string | undefined;
}>;

export default function MXPage({ children, sessionId, proposalName }: Props) {
  return (
    <Page selected="sessions">
      <SessionTabMenu sessionId={sessionId} proposalName={proposalName}></SessionTabMenu>
      {children}
    </Page>
  );
}
