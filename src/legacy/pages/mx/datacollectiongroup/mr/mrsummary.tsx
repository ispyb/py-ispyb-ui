import { useAuth } from 'hooks/useAuth';
import { usePhasingList } from 'legacy/hooks/ispyb';
import _ from 'lodash';
import { Card, Col } from 'react-bootstrap';
import { DataCollectionGroup } from '../../model';
import { parseUglymols, UglyMolPreview } from './mrTable';

export function MRSummary({
  proposalName,
  dataCollectionGroup,
  compact,
}: {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
  compact: boolean;
}) {
  const { data } = usePhasingList({
    proposalName,
    dataCollectionGroupId:
      dataCollectionGroup.DataCollectionGroup_dataCollectionGroupId?.toString() ||
      '-1',
  });

  const { site, token } = useAuth();

  if (!data || !data.length) return null;

  const results = data.flatMap((r) => r);

  const urlPrefix = `${site.host}${site.apiPrefix}/${token}`;

  const uglymols = _(results)
    .groupBy((r) => r.SpaceGroup_spaceGroupName)
    .map((group) => parseUglymols(group, proposalName, urlPrefix));
  const refined = uglymols
    .map((u) => u.refined)
    .filter((u) => u !== undefined)
    .get(0);
  const mr = uglymols
    .map((u) => u.mr)
    .filter((u) => u !== undefined)
    .get(0);

  const density = uglymols
    .map((u) => u.density)
    .filter((u) => u !== undefined)
    .get(0);

  return (
    <Card style={{ padding: 20 }}>
      <Card.Body>
        <Col>
          <h5 className="text-center">Phasing</h5>
          <div
            style={{
              marginTop: 10,
              marginBottom: 10,
              borderTop: '1px solid lightgray',
            }}
          />
        </Col>
        {refined || density || mr ? (
          <UglyMolPreview src={refined || density || mr || ''} title="Open" />
        ) : null}
      </Card.Body>
    </Card>
  );
}
