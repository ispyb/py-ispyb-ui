import { useState } from 'react';
import UI from 'legacy/config/ui';
import format from 'date-fns/format';
import SessionTable from 'legacy/pages/session/sessiontable';
import { useSessions } from 'legacy/hooks/ispyb';
import { useGetBeamlines } from 'legacy/hooks/site';
import { allSessionsEmpty, sessionIsEmpty } from 'legacy/helpers/sessionhelper';
import { useAuth } from 'hooks/useAuth';
import { usePersistentParamState } from 'hooks/useParam';

export default function SessionsPage() {
  const { javaPerson } = useAuth();
  const isManager =
    javaPerson?.roles.some((r) => r.toLowerCase().includes('manager')) || false;
  const username = javaPerson?.username || '';
  const [areEMColumnsVisible, setAreEMColumnsVisible] = useState(true);
  const [areMXColumnsVisible, setAreMXColumnsVisible] = useState(true);

  const beamlines: string[] = useGetBeamlines({
    areMXColumnsVisible,
    areEMColumnsVisible,
  });

  const [startDate, setStartDate] = usePersistentParamState<string>(
    'startDate',
    format(new Date(Date.now() - 3600 * 1000 * 24), 'yyyyMMdd')
  );
  const [endDate, setEndDate] = usePersistentParamState<string>(
    'endDate',
    format(new Date(Date.now() + 3600 * 1000 * 24), 'yyyyMMdd')
  );

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
      setAreEMColumnsVisible={setAreEMColumnsVisible}
      setAreMXColumnsVisible={setAreMXColumnsVisible}
      userPortalLink={UI.sessionsPage.userPortalLink}
    ></SessionTable>
  );
}
