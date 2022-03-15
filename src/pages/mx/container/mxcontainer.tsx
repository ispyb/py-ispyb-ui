import SimpleParameterTable from 'components/table/simpleparametertable';
import { useMXContainers } from 'hooks/ispyb';
import _ from 'lodash';
import { range } from 'lodash';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './mxcontainer.css';

export const positionsUni = [
  { x: '75', y: '47.72727272727273' },
  { x: '49.062095010132175', y: '66.57226378977415' },
  { x: '58.96949311929619', y: '97.06409984658947' },
  { x: '91.03050688070381', y: '97.06409984658947' },
  { x: '100.93790498986783', y: '66.57226378977417' },
  { x: '75', y: '18.75' },
  { x: '44.588954018122635', y: '27.67948877824606' },
  { x: '23.833200261308342', y: '51.63290551864389' },
  { x: '19.32254389419753', y: '83.00520965287228' },
  { x: '32.48908644257297', y: '111.83591628442228' },
  { x: '59.152543677669584', y: '128.97147976581547' },
  { x: '90.8474563223304', y: '128.97147976581547' },
  { x: '117.51091355742702', y: '111.8359162844223' },
  { x: '130.67745610580246', y: '83.0052096528723' },
  { x: '126.16679973869167', y: '51.63290551864391' },
  { x: '105.41104598187735', y: '27.67948877824606' },
];
export const positionsSpine = [
  { x: '75', y: '18.75' },
  { x: '41.93707955854838', y: '29.492794066409203' },
  { x: '21.503070958397615', y: '57.6177940664092' },
  { x: '21.503070958397608', y: '92.3822059335908' },
  { x: '41.93707955854838', y: '120.5072059335908' },
  { x: '75', y: '131.25' },
  { x: '108.06292044145161', y: '120.5072059335908' },
  { x: '128.49692904160239', y: '92.3822059335908' },
  { x: '128.49692904160239', y: '57.6177940664092' },
  { x: '108.06292044145162', y: '29.492794066409203' },
];

export function MXContainer({
  proposalName,
  sessionId,
  containerId,
  removeSelectedGroups = () => undefined,
  addSelectedGroups = () => undefined,
  selectedGroups = [],
}: {
  proposalName: string;
  sessionId: string;
  containerId: string;
  selectedGroups?: number[];
  // eslint-disable-next-line no-unused-vars
  removeSelectedGroups?: (ids: number[]) => void;
  // eslint-disable-next-line no-unused-vars
  addSelectedGroups?: (ids: number[]) => void;
}) {
  const { data: samples, isError: isErrorContainer } = useMXContainers({ proposalName, containerIds: [containerId] });
  if (isErrorContainer) throw Error(isErrorContainer);
  const sampleByPosition = _(samples)
    .groupBy((s) => s.BLSample_location)
    .value();
  let maxPosition = _(Object.keys(sampleByPosition))
    .map((n) => Number(n))
    .max();
  if (!maxPosition || maxPosition <= 10) {
    maxPosition = 10;
  } else {
    maxPosition = 16;
  }
  const positions = maxPosition == 10 ? positionsSpine : positionsUni;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg style={{ maxWidth: 200 }} viewBox="-5 -5 160 160">
        <circle cx="75" cy="75" r="75" fill="#CCCCCC" className="puck"></circle>
        {maxPosition == 16 && (
          <g fill="#888888" stroke="#888888" pointer-events="none">
            <circle cx="75" cy="78.75" r="7.5"></circle>
            <circle cx="67.5" cy="71.25" r="3.75" stroke-width="1"></circle>
            <circle cx="82.5" cy="71.25" r="3.75" stroke-width="1"></circle>
            <circle cx="75" cy="112.5" r="7.5"></circle>
          </g>
        )}

        {range(1, maxPosition + 1).map((n) => {
          const position = positions[n - 1];
          const sampleArray = sampleByPosition[String(n)];

          const collected = sampleArray && sampleArray.length && sampleArray.filter((s) => Number(sessionId) == s?.sessionId);
          const collectionIds = collected && collected.length && collected.map((s) => s.DataCollectionGroup_dataCollectionGroupId).filter((id) => id);
          //   const collectionIdsString = collectionIds && collectionIds.length && collectionIds.join(',');

          const selected =
            collectionIds &&
            collectionIds.length &&
            _(collectionIds)
              .map((i) => selectedGroups.includes(i))
              .reduce((a, b) => a && b, true);

          const refSample = collected && collected.length ? collected[0] : sampleArray && sampleArray.length && sampleArray[0];

          if (refSample) {
            const className = collected && collected.length ? (selected ? 'sampleCollectedSelected' : 'sampleCollected') : 'sampleFilled';
            return (
              <>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip>
                      Protein
                      <p>
                        <Badge style={{ margin: 0 }} bg="info">
                          {refSample.Protein_acronym}
                        </Badge>
                      </p>
                      Sample
                      <p>
                        <Badge style={{ margin: 0 }} bg="info">
                          {refSample.BLSample_name}
                        </Badge>
                      </p>
                    </Tooltip>
                  }
                >
                  {/* <a href={refSample.sessionId ? `/${proposalName}/MX/${refSample.sessionId}?groups=${collectionIds}` : undefined}> */}
                  <circle
                    onClick={() => {
                      if (collectionIds) {
                        selected ? removeSelectedGroups(collectionIds) : addSelectedGroups(collectionIds);
                      }
                    }}
                    className={className}
                    cx={position.x}
                    cy={position.y}
                    r="13.138736566410419"
                  ></circle>
                  {/* </a> */}
                </OverlayTrigger>
                <text className={className} x={position.x} y={position.y}>
                  <tspan dx="0" dy="3" pointer-events="none">
                    {n}
                  </tspan>
                </text>
              </>
            );
          }
          return (
            <>
              <circle className="sampleEmpty" cx={position.x} cy={position.y} r="13.138736566410419"></circle>
              <text x={position.x} y={position.y} fill="white" font-size="8.25" text-anchor="middle" pointer-events="none">
                <tspan dx="0" dy="3" pointer-events="none">
                  {n}
                </tspan>
              </text>
            </>
          );
        })}
      </svg>
      <div>
        <SimpleParameterTable
          parameters={[
            { key: 'Container', value: samples ? samples[0].Container_code : undefined },
            { key: 'Location', value: samples ? samples[0].Container_sampleChangerLocation : undefined },
          ]}
        ></SimpleParameterTable>
      </div>
    </div>
  );
}
