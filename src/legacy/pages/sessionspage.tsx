import React, { useState } from 'react';
import UI from 'legacy/config/ui';
import format from 'date-fns/format';
import SessionTable from 'legacy/pages/session/sessiontable';
import useQueryParams from 'legacy/hooks/usequeyparams';
import { useSessions } from 'legacy/hooks/ispyb';
import { useGetBeamlines } from 'legacy/hooks/site';
import { allSessionsEmpty, sessionIsEmpty } from 'legacy/helpers/sessionhelper';
import { useAuth } from 'hooks/useAuth';

export default function SessionsPage() {
  const { javaPerson } = useAuth();
  const isManager = javaPerson?.roles.includes('Manager') || false;
  const username = javaPerson?.username || '';
  const [areEMColumnsVisible, setAreEMColumnsVisible] = useState(true);
  const [areMXColumnsVisible, setAreMXColumnsVisible] = useState(true);
  const [areSAXSColumnsVisible, setAreSAXSColumnsVisible] = useState(false);

  const beamlines: string[] = useGetBeamlines({
    areMXColumnsVisible,
    areSAXSColumnsVisible,
    areEMColumnsVisible,
  });
  const params: Record<string, string> = useQueryParams();

  let { startDate: paramStartDate, endDate: paramEndDate } = params;
  if (!paramStartDate && !paramEndDate) {
    paramStartDate = format(new Date(), 'yyyyMMdd');
    paramEndDate = format(new Date(Date.now() + 3600 * 1000 * 24), 'yyyyMMdd');
  }

  const [startDate, setStartDate] = useState<string>(paramStartDate);
  const [endDate, setEndDate] = useState<string>(paramEndDate);

  const { data, isError } = useSessions({
    startDate,
    endDate,
    isManager,
    username,
  });
  if (isError) throw Error(isError);

  const [showEmptySessions, setShowEmptySessions] = useState(
    allSessionsEmpty(data)
  );

  const filteredData = showEmptySessions
    ? data
    : data?.filter((s) => !sessionIsEmpty(s));

  return (
    <SessionTable
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      showEmptySessions={showEmptySessions}
      setShowEmptySessions={setShowEmptySessions}
      // eslint-disable-next-line
      data={filteredData?.filter((d: any) =>
        new Set(beamlines).has(d.beamLineName)
      )}
      areEMColumnsVisible={areEMColumnsVisible}
      areMXColumnsVisible={areMXColumnsVisible}
      areSAXSColumnsVisible={areSAXSColumnsVisible}
      setAreEMColumnsVisible={setAreEMColumnsVisible}
      setAreMXColumnsVisible={setAreMXColumnsVisible}
      setAreSAXSColumnsVisible={setAreSAXSColumnsVisible}
      userPortalLink={UI.sessionsPage.userPortalLink}
    ></SessionTable>
  );
}
