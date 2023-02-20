import { UglyMolPreview } from 'components/Molecules/UglymolViewer';
import { useAuth } from 'hooks/useAuth';
import { usePhasingList } from 'legacy/hooks/ispyb';
import _ from 'lodash';
import { Card, Col } from 'react-bootstrap';
import { DataCollectionGroup } from '../../model';
import { parseUglymols } from './phasingList';

export function PhasingSummary({
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

  const lig = uglymols
    .map((u) => u.lig)
    .filter((u) => u !== undefined)
    .get(0);
  const newlig = uglymols
    .map((u) => u.newlig)
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
        {refined ? <UglyMolPreview mol={refined} title="Refined" /> : null}
        {density ? <UglyMolPreview mol={density} title="Density" /> : null}
        {mr ? <UglyMolPreview mol={mr} title="MR" /> : null}
        {lig ? <UglyMolPreview mol={lig} title="Ligand" /> : null}
        {newlig ? <UglyMolPreview mol={newlig} title="New ligand" /> : null}
      </Card.Body>
    </Card>
  );
}
