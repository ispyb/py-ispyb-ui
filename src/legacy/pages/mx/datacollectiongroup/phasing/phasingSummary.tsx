import { HelpIcon } from 'components/Common/HelpIcon';
import { UglyMolPreview } from 'components/Molecules/UglymolViewer';
import { useAuth } from 'hooks/useAuth';
import {
  parsePhasingStepsForSummary,
  PHASING_RANKING_METHOD_DESCRIPTION,
} from 'legacy/helpers/mx/results/phasingparser';
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

  const summaryPhasings = parsePhasingStepsForSummary(
    results,
    proposalName,
    urlPrefix
  );

  if (!summaryPhasings || !summaryPhasings.length) return null;
  return (
    <>
      {summaryPhasings.map((p) => (
        <Col
          sm={12}
          md={6}
          xl={compact ? 4 : 4}
          xxl={compact ? 4 : 3}
          key={p.phasing.PhasingStep_phasingStepId}
        >
          <Card
            key={p.phasing.PhasingStep_phasingStepId}
            style={{ padding: 20 }}
          >
            <Card.Body>
              <Col>
                <h5 className="text-center">
                  {p.phasing.PhasingStep_method} phasing{' '}
                  <HelpIcon
                    message={[
                      `This is the best ${p.phasing.PhasingStep_method} result for this data collection group. Click on the phasing tab to see more.`,
                      ...PHASING_RANKING_METHOD_DESCRIPTION,
                    ]}
                  ></HelpIcon>
                </h5>
                <Row style={{ justifyContent: 'center' }}>
                  <Col xs={'auto'}>
                    <Badge style={{ margin: 0 }}>
                      {p.phasing.PhasingStep_method}
                    </Badge>
                  </Col>
                  <Col xs={'auto'}>
                    <Badge style={{ margin: 0 }}>
                      {p.phasing.PhasingProgramRun_phasingPrograms}
                    </Badge>
                  </Col>
                  <Col xs={'auto'}>
                    <Badge style={{ margin: 0 }}>
                      {p.phasing.SpaceGroup_spaceGroupName}
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
              <UglyMolPreview mol={p.molecules[0]} />
            </Card.Body>
          </Card>
        </Col>
      ))}
    </>
  );
}
