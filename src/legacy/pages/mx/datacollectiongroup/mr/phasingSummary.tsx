import { UglyMolPreview } from 'components/Molecules/UglymolViewer';
import { useAuth } from 'hooks/useAuth';
import { getBestMol, parseMols } from 'legacy/helpers/mx/results/phasingparser';
import { usePhasingList } from 'legacy/hooks/ispyb';
import { Badge, Card, Col, Row } from 'react-bootstrap';
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
  if (!bestMolecule) return null;
  return (
    <Card style={{ padding: 20 }}>
      <Card.Body>
        <Col>
          <h5 className="text-center">Phasing</h5>

          <Row style={{ justifyContent: 'center' }}>
            <Col xs={'auto'}>
              <Badge style={{ margin: 0 }}>
                {bestMolecule.phasing.PhasingStep_method}
              </Badge>
            </Col>
            <Col xs={'auto'}>
              <Badge style={{ margin: 0 }}>
                {bestMolecule.phasing.PhasingProgramRun_phasingPrograms}
              </Badge>
            </Col>
            <Col xs={'auto'}>
              <Badge style={{ margin: 0 }}>
                {bestMolecule.phasing.SpaceGroup_spaceGroupName}
              </Badge>
            </Col>
          </Row>
          <div
            style={{
              marginTop: 10,
              marginBottom: 10,
              borderTop: '1px solid lightgray',
            }}
          />
        </Col>
        <UglyMolPreview mol={bestMolecule} />
      </Card.Body>
    </Card>
  );
}
