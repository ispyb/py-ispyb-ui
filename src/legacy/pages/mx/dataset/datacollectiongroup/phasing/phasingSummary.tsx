import { HelpIcon } from 'components/Common/HelpIcon';
import { UglyMolPreview } from 'components/Molecules/UglymolViewer';
import { useAuth } from 'hooks/useAuth';
import {
  parsePhasingStepsForSummary,
  PHASING_RANKING_METHOD_DESCRIPTION,
} from 'legacy/helpers/mx/results/phasingparser';
import { usePhasingList } from 'legacy/hooks/ispyb';
import { useMemo } from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';
import { DataCollectionGroup } from '../../../model';

export function PhasingSummary({
  proposalName,
  dataCollectionGroup,
}: {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
}) {
  const { data } = usePhasingList({
    proposalName,
    dataCollectionGroupId:
      dataCollectionGroup.DataCollectionGroup_dataCollectionGroupId?.toString() ||
      '-1',
  });

  const { site, token } = useAuth();

  const results = useMemo(() => (data || []).flatMap((r) => r), [data]);

  const urlPrefix = `${site.host}${site.apiPrefix}/${token}`;

  const summaryPhasings = useMemo(
    () => parsePhasingStepsForSummary(results, proposalName, urlPrefix),
    [proposalName, results, urlPrefix]
  );
  if (!summaryPhasings || !summaryPhasings.length) return null;
  return (
    <Card style={{ padding: 20, paddingTop: 0 }}>
      <Card.Body>
        <Col>
          {summaryPhasings.map((p) => (
            <Row
              key={p.phasing.PhasingStep_phasingStepId}
              style={{ paddingTop: 20 }}
            >
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
              <UglyMolPreview mol={p.molecules[0]} />
            </Row>
          ))}
        </Col>
      </Card.Body>
    </Card>
  );
}
