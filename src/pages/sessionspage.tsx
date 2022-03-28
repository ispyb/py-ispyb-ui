import React, { useState } from 'react';
import UI from 'config/ui';
import format from 'date-fns/format';
import SessionTable from 'pages/session/sessiontable';
import useQueryParams from 'hooks/usequeyparams';
import { useSessions } from 'hooks/ispyb';
import { useAppSelector } from 'hooks';
import { useGetBeamlines } from 'hooks/site';
import Page from 'pages/page';
import { User } from 'models';

export default function SessionsPage({ user }: { user: User }) {
  const { isManager, username } = user;
  const { areEMColumnsVisible, areMXColumnsVisible, areSAXSColumnsVisible } = useAppSelector((state) => state.ui.sessionsPage);
  const beamlines: string[] = useGetBeamlines({ areMXColumnsVisible, areSAXSColumnsVisible, areEMColumnsVisible });
  const params: Record<string, string> = useQueryParams();

  let { startDate: paramStartDate, endDate: paramEndDate } = params;
  if (!paramStartDate && !paramEndDate) {
    paramStartDate = format(new Date(), 'yyyyMMdd');
    paramEndDate = format(new Date(Date.now() + 3600 * 1000 * 24), 'yyyyMMdd');
  }

  const [startDate, setStartDate] = useState<string>(paramStartDate);
  const [endDate, setEndDate] = useState<string>(paramEndDate);

  const { data, isError } = useSessions({ startDate, endDate, isManager, username });
  if (isError) throw Error(isError);

  return (
    <Page>
      <SessionTable
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        // eslint-disable-next-line
        data={data?.filter((d: any) => new Set(beamlines).has(d.beamLineName))}
        areEMColumnsVisible={areEMColumnsVisible}
        areMXColumnsVisible={areMXColumnsVisible}
        areSAXSColumnsVisible={areSAXSColumnsVisible}
        userPortalLink={UI.sessionsPage.userPortalLink}
      ></SessionTable>
    </Page>
  );
}
