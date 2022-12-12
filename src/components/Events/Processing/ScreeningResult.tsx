import { useSuspense } from 'rest-hooks';
import { Card, ListGroup } from 'react-bootstrap';

import Table from 'components/Layout/Table';
import { ScreeningResource } from 'api/resources/Processing/Screening';

export default function ScreeningResult({
  dataCollectionId,
}: {
  dataCollectionId: number;
}) {
  const screenings = useSuspense(ScreeningResource.list(), {
    dataCollectionId,
  });

  const cellParams: Record<string, string> = {
    SpaceGroup: 'spaceGroup',
    A: 'unitCell_a',
    B: 'unitCell_b',
    C: 'unitCell_c',
    Alpha: 'unitCell_alpha',
    Beta: 'unitCell_beta',
    Gamma: 'unitCell_gamma',
  };

  return (
    <>
      {!screenings.results && <p>No Screening Results</p>}
      {screenings.results.map((result) => (
        <div>
          <h1>{result.programVersion}</h1>
          <p>
            {result.shortComments} - {result.comments}
          </p>
          <Card>
            <ListGroup horizontal="sm">
              {Object.entries(cellParams).map(([key, value]) => (
                <ListGroup.Item>
                  {key}:{' '}
                  {
                    // @ts-ignore
                    result.ScreeningOutput?.[0].ScreeningOutputLattice?.[0]?.[
                      value
                    ]
                  }
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
          <h2>Wedges</h2>
          <Table
            size="sm"
            keyId="screeningStrategyWedgeId"
            results={
              result.ScreeningOutput?.[0].ScreeningStrategy?.[0]
                .ScreeningStrategyWedge || []
            }
            columns={[
              { label: 'Comments', key: 'comments' },
              { label: 'Resolution', key: 'resolution' },
              { label: 'Multiplicity', key: 'multiplicity' },
              { label: 'Completeness', key: 'completeness' },
              { label: '# Images', key: 'numberOfImages' },
              { label: 'Chi', key: 'chi' },
              { label: 'Phi', key: 'phi' },
            ]}
          />
          <h2>Sub-Wedges</h2>
          <Table
            size="sm"
            keyId="screeningStrategySubWedgeId"
            results={
              result.ScreeningOutput?.[0].ScreeningStrategy?.[0]
                .ScreeningStrategyWedge?.[0].ScreeningStrategySubWedge || []
            }
            columns={[
              { label: 'Comments', key: 'comments' },
              { label: 'Axis', key: 'rotationAxis' },
              { label: 'Axis Start', key: 'axisStart' },
              { label: 'Axis End', key: 'axisEnd' },
              { label: '# Images', key: 'numberOfImages' },
              { label: 'Axis Osc', key: 'oscillationRange' },
              { label: 'Exposure', key: 'exposureTime' },
            ]}
          />
        </div>
      ))}
    </>
  );
}
