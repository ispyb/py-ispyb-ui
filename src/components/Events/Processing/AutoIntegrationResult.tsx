import { useSuspense } from 'rest-hooks';
import { Card, ListGroup, Tab, Tabs } from 'react-bootstrap';

import Table, { IColumn } from 'components/Layout/Table';
import {
  AutoProcProgramIntegration as AutoProcProgramIntegrationType,
  AutoProcScalingStatistics as AutoProcScalingStatisticsType,
} from 'models/AutoProcProgramIntegration.d';
import { messageStatusIcons } from '../AutoProcProgramMessages';
import { AutoProcProgramIntegrationResource } from 'api/resources/Processing/AutoProcProgramIntegration';
import { ActionsCell } from './ProcessingResult';

function SummaryCell(row: AutoProcProgramIntegrationType, column: IColumn) {
  const shells =
    row.AutoProcIntegration?.[0].AutoProcScalingHasInt &&
    row.AutoProcIntegration?.[0].AutoProcScalingHasInt[0] &&
    row.AutoProcIntegration?.[0].AutoProcScalingHasInt?.[0].AutoProcScaling
      ?.AutoProcScalingStatistics;
  const shellName =
    (column.formatterParams && column.formatterParams.shell) || 'overall';
  const overall =
    shells &&
    shells.filter((shell) => shell.scalingStatisticsType === shellName);

  if (!overall || (overall && overall.length === 0)) {
    return <></>;
  }
  return (
    <>
      {overall && overall[0][column.key as keyof AutoProcScalingStatisticsType]}
    </>
  );
}

export default function AutoIntegrationResult({
  dataCollectionId,
}: {
  dataCollectionId: number;
}) {
  const processings = useSuspense(AutoProcProgramIntegrationResource.list(), {
    dataCollectionId,
    limit: 50,
  });

  const cellParams: Record<string, string> = {
    A: 'refinedCell_a',
    B: 'refinedCell_b',
    C: 'refinedCell_c',
    Alpha: 'refinedCell_alpha',
    Beta: 'refinedCell_beta',
    Gamma: 'refinedCell_gamma',
  };

  return (
    <>
      <Table
        size="sm"
        keyId="autoProcProgramId"
        results={processings.results}
        columns={[
          { label: 'Program', key: 'processingPrograms' },
          {
            label: 'Resolution',
            key: 'resolutionLimitHigh',
            formatter: SummaryCell,
          },
          {
            label: 'Space Group',
            key: 'AutoProcIntegration[0].AutoProcScalingHasInt[0].AutoProcScaling.AutoProc.spaceGroup',
          },
          {
            label: 'I/sig(I)',
            key: 'meanIOverSigI',
            formatter: SummaryCell,
          },
          {
            label: 'Rmeas Inner',
            key: 'rMeasAllIPlusIMinus',
            formatter: SummaryCell,
            formatterParams: { shell: 'innerShell' },
          },
          {
            label: 'Rmeas Outer',
            key: 'rMeasAllIPlusIMinus',
            formatter: SummaryCell,
            formatterParams: { shell: 'outerShell' },
          },
          {
            label: 'Completeness',
            key: 'completeness',
            formatter: SummaryCell,
          },
          { label: 'Message', key: 'processingMessage' },
          {
            label: '',
            key: 'actions',
            formatter: ActionsCell,
            className: 'text-end',
          },
        ]}
        emptyText="No auto integrations yet"
      />
      <Tabs>
        {processings.results.map((result) => {
          const autoProcIntegration = result.AutoProcIntegration?.[0];
          const autoProcScalingHasInt =
            autoProcIntegration?.AutoProcScalingHasInt?.[0];

          const messageTypes: string[] = [
            // @ts-ignore
            ...new Set(
              result._metadata.autoProcProgramMessages?.map(
                (message) => message.severity
              )
            ),
          ].filter((type) => type !== 'INFO');

          const title = (
            <>
              {result.processingPrograms}{' '}
              {messageTypes.map((type) => messageStatusIcons[type])}
            </>
          );

          return (
            <Tab eventKey={result.autoProcProgramId} title={title}>
              {/* <AttachmentsButton {...result} /> */}
              {result.processingStatus === 0 && (
                <p>This job failed: {result.processingMessage}</p>
              )}

              {result.processingStatus === 1 && (
                <>
                  <Table
                    size="sm"
                    keyId="autoProcProgramId"
                    results={[
                      {
                        type: 'Start',
                        x: result.AutoProcIntegration?.[0].DataCollection
                          ?.xBeam,
                        y: result.AutoProcIntegration?.[0].DataCollection
                          ?.yBeam,
                      },
                      {
                        type: 'End',
                        x: result.AutoProcIntegration?.[0].refinedXBeam,
                        y: result.AutoProcIntegration?.[0].refinedYBeam,
                      },
                      {
                        type: 'Δ',
                        x:
                          result.AutoProcIntegration?.[0].refinedXBeam !==
                            undefined &&
                          result.AutoProcIntegration?.[0].DataCollection
                            ?.xBeam !== undefined &&
                          result.AutoProcIntegration?.[0].refinedXBeam -
                            result.AutoProcIntegration?.[0].DataCollection
                              ?.xBeam,
                        y:
                          result.AutoProcIntegration?.[0].refinedYBeam !==
                            undefined &&
                          result.AutoProcIntegration?.[0].DataCollection
                            ?.yBeam !== undefined &&
                          result.AutoProcIntegration?.[0].refinedYBeam -
                            result.AutoProcIntegration?.[0].DataCollection
                              ?.yBeam,
                      },
                    ]}
                    columns={[
                      { label: 'Beam Center', key: 'type' },
                      { label: 'X', key: 'x' },
                      { label: 'Y', key: 'y' },
                    ]}
                  />
                  {autoProcScalingHasInt && (
                    <>
                      <Card>
                        <Card.Body>
                          {
                            autoProcScalingHasInt.AutoProcScaling?.AutoProc
                              ?.spaceGroup
                          }
                        </Card.Body>
                        <ListGroup horizontal="sm">
                          {Object.entries(cellParams).map(([key, value]) => (
                            <ListGroup.Item>
                              {key}:{' '}
                              {
                                // @ts-ignore
                                autoProcScalingHasInt.AutoProcScaling
                                  ?.AutoProc?.[value]
                              }
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card>
                      <Table
                        size="sm"
                        keyId="scalingStatisticsType"
                        results={
                          autoProcScalingHasInt.AutoProcScaling
                            ?.AutoProcScalingStatistics || []
                        }
                        columns={[
                          { label: 'Shell', key: 'scalingStatisticsType' },
                          { label: 'Obs', key: 'nTotalObservations' },
                          { label: 'Unique', key: 'nTotalUniqueObservations' },
                          {
                            label: 'Resolution',
                            key: 'resolutionLimitHigh',
                            formatter: (row) =>
                              `${row.resolutionLimitHigh} - ${row.resolutionLimitLow}`,
                          },
                          { label: 'Rmeas', key: 'rMeasAllIPlusIMinus' },
                          { label: 'I/sig(I)', key: 'meanIOverSigI' },
                          { label: 'cc 1/2', key: 'ccHalf' },
                          { label: 'Completeness', key: 'completeness' },
                          { label: 'Multiplicity', key: 'multiplicity' },
                          {
                            label: 'Anom Completeness',
                            key: 'anomalousCompleteness',
                          },
                          {
                            label: 'Anom Multiplicity',
                            key: 'anomalousMultiplicity',
                          },
                          { label: 'cc Anom', key: 'ccAnomalous' },
                        ]}
                      />
                    </>
                  )}
                </>
              )}
            </Tab>
          );
        })}
      </Tabs>
    </>
  );
}
