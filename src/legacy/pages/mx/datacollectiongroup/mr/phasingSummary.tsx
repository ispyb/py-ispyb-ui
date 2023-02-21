import { UglyMolPreview } from 'components/Molecules/UglymolViewer';
import { useAuth } from 'hooks/useAuth';
import { getBestMol, parseMols } from 'legacy/helpers/mx/results/phasingparser';
import { usePhasingList } from 'legacy/hooks/ispyb';
import { Card, Col } from 'react-bootstrap';
import { DataCollectionGroup } from '../../model';

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

  const molecules = results.flatMap((r) =>
    parseMols(r, proposalName, urlPrefix)
  );
  const bestMolecule = getBestMol(molecules);
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
        {bestMolecule ? <UglyMolPreview mol={bestMolecule} /> : null}
      </Card.Body>
    </Card>
  );
}
