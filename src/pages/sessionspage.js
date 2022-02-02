import React from 'react';
import UI from 'config/ui';
import format from 'date-fns/format';
import SessionTable from 'pages/session/sessiontable';
import useQueryParams from 'hooks/usequeyparams';
import { useSession } from 'hooks/ispyb';
import { useAppSelector } from 'hooks';
import { useBeamlines } from 'hooks/site';

export default function SessionsPage() {
  const { areEMColumnsVisible, areMXColumnsVisible, areSAXSColumnsVisible } = useAppSelector((state) => state.ui.sessionsPage);
  const { startDate = format(new Date(), 'yyyyMMdd'), endDate = format(new Date(Date.now() + 3600 * 1000 * 24), 'yyyyMMdd') } = useQueryParams();
  const { data, error } = useSession({ startDate, endDate });
  let beamlines = [];
  if (areMXColumnsVisible) {
    beamlines = beamlines.concat(useBeamlines('MX'));
  }

  if (areSAXSColumnsVisible) {
    beamlines = beamlines.concat(useBeamlines('SAXS'));
  }

  if (areEMColumnsVisible) {
    beamlines = beamlines.concat(useBeamlines('EM'));
  }
  if (error) throw Error(error);

  return (
    <SessionTable
      startDate={startDate}
      endDate={endDate}
      data={data.filter((d) => new Set(beamlines).has(d.beamLineName))}
      areEMColumnsVisible={areEMColumnsVisible}
      areMXColumnsVisible={areMXColumnsVisible}
      areSAXSColumnsVisible={areSAXSColumnsVisible}
      userPortalLink={UI.sessionsPage.userPortalLink}
    ></SessionTable>
  );
}
