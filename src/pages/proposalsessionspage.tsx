import React, { useState } from 'react';
import UI from 'config/ui';
import SessionTable from 'pages/session/sessiontable';
import { useSessions } from 'hooks/ispyb';
import { useAppSelector } from 'hooks';
import { useGetBeamlines } from 'hooks/site';
import Page from 'pages/page';
import { User } from 'models';
import { useParams } from 'react-router-dom';
import { sessionIsEmpty } from 'helpers/sessionhelper';

type Param = {
  proposalName: string;
};

export default function ProposalSessionsPage({ user }: { user: User }) {
  const { proposalName } = useParams<Param>();

  const { isManager, username } = user;
  const { areEMColumnsVisible, areMXColumnsVisible, areSAXSColumnsVisible } = useAppSelector((state) => state.ui.sessionsPage);
  const beamlines: string[] = useGetBeamlines({ areMXColumnsVisible, areSAXSColumnsVisible, areEMColumnsVisible });

  const { data, isError } = useSessions({ isManager, username, proposalName });
  if (isError) throw Error(isError);

  const [showEmptySessions, setShowEmptySessions] = useState(false);

  const filteredData = showEmptySessions ? data : data?.filter((s) => !sessionIsEmpty(s));

  return (
    <Page selected="sessions">
      <SessionTable
        showDatePicker={false}
        // eslint-disable-next-line
        data={filteredData?.filter((d: any) => new Set(beamlines).has(d.beamLineName))}
        areEMColumnsVisible={areEMColumnsVisible}
        areMXColumnsVisible={areMXColumnsVisible}
        areSAXSColumnsVisible={areSAXSColumnsVisible}
        userPortalLink={UI.sessionsPage.userPortalLink}
        showEmptySessions={showEmptySessions}
        setShowEmptySessions={setShowEmptySessions}
      ></SessionTable>
    </Page>
  );
}
