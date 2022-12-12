import { useSuspense } from 'rest-hooks';
import { useNavigate } from 'react-router-dom';

import Table from 'components/Layout/Table';
import { SessionResource } from 'api/resources/Session';
import { Session } from 'models/Session';
import { usePath } from 'hooks/usePath';
import { Badge } from 'react-bootstrap';
import { usePaging } from 'hooks/usePaging';

export default function SessionList({ sortBy }: { sortBy?: string }) {
  const { skip, limit } = usePaging(10);
  const navigate = useNavigate();
  const proposal = usePath('proposal');
  const sessions = useSuspense(SessionResource.list(), {
    skip,
    limit,
    ...(proposal ? { proposal } : {}),
  });

  const onRowClick = (row: Session) => {
    navigate(`/proposals/${proposal}/sessions/${row.sessionId}`);
  };

  return (
    <section>
      <h1>Sessions</h1>
      <Table
        keyId="sessionId"
        results={sessions.results}
        onRowClick={onRowClick}
        paginator={{
          total: sessions.total,
          skip: sessions.skip,
          limit: sessions.limit,
        }}
        columns={[
          { label: 'Id', key: 'sessionId' },
          { label: 'Session', key: 'session' },
          { label: 'Start', key: 'startDate' },
          { label: 'End', key: 'endDate' },
          { label: 'Beamline', key: 'beamLineName' },
          {
            label: 'Type',
            key: 'Type',
            formatter: (row: Session) => row._metadata.sessionTypes.join(','),
          },
          { label: '# DCs', key: '_metadata.datacollections' },
          {
            label: 'Active',
            key: 'active',
            formatter: (row: Session) =>
              row._metadata.active ? <Badge bg="success">Active</Badge> : null,
          },
        ]}
        emptyText="No sessions yet"
      />
    </section>
  );
}
