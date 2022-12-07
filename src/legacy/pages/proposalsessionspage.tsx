import React, { useState } from 'react';
import UI from 'legacy/config/ui';
import SessionTable from 'legacy/pages/session/sessiontable';
import { useSessions } from 'legacy/hooks/ispyb';
import { useGetBeamlines } from 'legacy/hooks/site';
import { useParams } from 'react-router-dom';
import { sessionIsEmpty } from 'legacy/helpers/sessionhelper';
import { useAuth } from 'hooks/useAuth';

type Param = {
  proposalName: string;
};

export default function ProposalSessionsPage() {
  const { javaPerson } = useAuth();
  const isManager = javaPerson?.roles.includes('Manager') || false;
  const username = javaPerson?.username || '';
  const { proposalName } = useParams<Param>();
  const [areEMColumnsVisible, setAreEMColumnsVisible] = useState(true);
  const [areMXColumnsVisible, setAreMXColumnsVisible] = useState(true);
  const [areSAXSColumnsVisible, setAreSAXSColumnsVisible] = useState(false);
  const beamlines: string[] = useGetBeamlines({
    areMXColumnsVisible,
    areSAXSColumnsVisible,
    areEMColumnsVisible,
  });

  const { data, isError } = useSessions({ isManager, username, proposalName });
  if (isError) throw Error(isError);

  const [showEmptySessions, setShowEmptySessions] = useState(false);

  const filteredData = showEmptySessions
    ? data
    : data?.filter((s) => !sessionIsEmpty(s));

  return (
    <SessionTable
      showDatePicker={false}
      // eslint-disable-next-line
      data={filteredData?.filter((d: any) =>
        new Set(beamlines).has(d.beamLineName)
      )}
      userPortalLink={UI.sessionsPage.userPortalLink}
      showEmptySessions={showEmptySessions}
      setShowEmptySessions={setShowEmptySessions}
      areEMColumnsVisible={areEMColumnsVisible}
      areMXColumnsVisible={areMXColumnsVisible}
      areSAXSColumnsVisible={areSAXSColumnsVisible}
      setAreEMColumnsVisible={setAreEMColumnsVisible}
      setAreMXColumnsVisible={setAreMXColumnsVisible}
      setAreSAXSColumnsVisible={setAreSAXSColumnsVisible}
    ></SessionTable>
  );
}
