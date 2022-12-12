import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { getContainerType } from 'legacy/helpers/mx/samplehelper';
import { useMXContainers } from 'legacy/hooks/ispyb';
import _ from 'lodash';
import { range } from 'lodash';
import { containerType } from 'legacy/models';
import { PropsWithChildren } from 'react';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Sample } from '../model';
import './mxcontainer.scss';

const containerRadius = 75;

export function MXContainer({
  proposalName,
  sessionId,
  containerId,
  containerType,
  removeSelectedGroups = undefined,
  addSelectedGroups = undefined,
  selectedGroups = [],
  showInfo = true,
  onContainerClick = undefined,
}: {
  proposalName: string;
  sessionId?: string;
  containerId: string;
  containerType?: containerType;
  selectedGroups?: number[];
  showInfo?: boolean;
  onContainerClick?: () => void;
  // eslint-disable-next-line no-unused-vars
  removeSelectedGroups?: (ids: number[]) => void;
  // eslint-disable-next-line no-unused-vars
  addSelectedGroups?: (ids: number[]) => void;
}) {
  const { data: samples, isError: isErrorContainer } = useMXContainers({
    proposalName,
    containerIds: [containerId],
  });
  if (isErrorContainer) throw Error(isErrorContainer);
  const sampleByPosition = _(samples)
    .groupBy((s) => s.BLSample_location)
    .value();

  const type = findContainerType(containerType, samples, sampleByPosition);
  if (type) {
    const svg = (
      <ContainerSVG
        maxPosition={type.maxPos}
        isSquare={type.isSquare}
        onContainerClick={onContainerClick}
      >
        {range(1, type.maxPos + 1).map((n) => {
          const position = type.computePos(n);

          const sampleArray = sampleByPosition[String(n)];

          let collected: 0 | Sample[] = sampleArray;

          if (sessionId) {
            collected =
              sampleArray &&
              sampleArray.length &&
              sampleArray.filter((s) => Number(sessionId) === s?.sessionId);
          }
          const collectionIds =
            collected &&
            collected.length &&
            collected
              .map((s) => s.DataCollectionGroup_dataCollectionGroupId)
              .filter((id) => id);
          const selected =
            collectionIds &&
            collectionIds.length &&
            _(collectionIds)
              .map((i) => selectedGroups.includes(i))
              .reduce((a, b) => a && b, true);

          const refSample =
            collected && collected.length
              ? collected[0]
              : sampleArray && sampleArray.length
              ? sampleArray[0]
              : undefined;

          const onClick =
            removeSelectedGroups && addSelectedGroups
              ? () => {
                  if (collectionIds) {
                    selected
                      ? removeSelectedGroups(collectionIds)
                      : addSelectedGroups(collectionIds);
                  }
                }
              : undefined;

          return (
            <SampleSVG
              position={position}
              n={n}
              refSample={refSample}
              collected={Boolean(collected && collected.length)}
              selected={Boolean(selected)}
              onClick={onClick}
              clickableContainer={onContainerClick !== undefined}
            ></SampleSVG>
          );
        })}
      </ContainerSVG>
    );
    if (!showInfo) {
      return svg;
    }
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {svg}
        <div>
          <SimpleParameterTable
            parameters={[
              {
                key: 'Container',
                value:
                  samples && samples.length
                    ? samples[0].Container_code
                    : 'unknown',
              },
              {
                key: 'Location',
                value:
                  samples && samples.length
                    ? samples[0].Container_sampleChangerLocation
                    : 'unknown',
              },
            ]}
          ></SimpleParameterTable>
        </div>
      </div>
    );
  }
  return <></>;
}

function computePos(
  radiusRatio: number,
  maxPosition: number,
  position: number
): { x: number | string; y: number | string } {
  const radius = radiusRatio * containerRadius;
  const step = (Math.PI * 2) / maxPosition;
  const angle = -(position - 1) * step;
  const x = Math.sin(angle) * radius + containerRadius;
  const y = containerRadius - Math.cos(angle) * radius;
  return { x, y };
}

const containerPlotTypes = {
  Spinepuck: {
    computePos: (position: number) => {
      return computePos(0.76, 10, position);
    },
    maxPos: 10,
    name: 'Spinepuck',
    isSquare: false,
  },
  Unipuck: {
    computePos: (position: number) => {
      if (position < 6) {
        return computePos(0.36, 5, position);
      }
      return computePos(0.76, 11, position - 5);
    },
    maxPos: 16,
    name: 'Unipuck',
    isSquare: false,
  },
  Other: {
    computePos: () => {
      return { x: 0, y: 0 };
    },
    maxPos: 0,
    name: 'OTHER',
    isSquare: true,
  },
};

export function getContainerPlotTypePositions(type: containerType) {
  if (type === 'Unipuck') {
    return containerPlotTypes.Unipuck;
  }
  if (type === 'Spinepuck') {
    return containerPlotTypes.Spinepuck;
  }
  if (type === 'PLATE') {
    return containerPlotTypes.Other;
  }
  if (type === 'OTHER') {
    return containerPlotTypes.Other;
  }
  return undefined;
}

function findContainerType(
  typeParam: string | undefined,
  samples: Sample[] | undefined,
  sampleByPosition: _.Dictionary<Sample[]>
) {
  // First look for type in params
  let type = getContainerType(typeParam);
  if (type === undefined) {
    // If not found, look for type in data
    type = getContainerType(
      samples?.length ? samples[0].Container_containerType : undefined
    );
  }

  if (type === undefined) {
    // If not found, try to guess type
    let maxPosition = _(Object.keys(sampleByPosition))
      .map((n) => Number(n))
      .max();
    if (!maxPosition || maxPosition <= 10) {
      maxPosition = 10;
    } else if (maxPosition <= 16) {
      maxPosition = 16;
    } else if (maxPosition <= 96) {
      maxPosition = 96;
    }
    type =
      maxPosition === 10
        ? 'Spinepuck'
        : maxPosition === 16
        ? 'Unipuck'
        : maxPosition === 96
        ? 'PLATE'
        : 'OTHER';
  }
  if (type === undefined) {
    return undefined;
  } else {
    return getContainerPlotTypePositions(type);
  }
}

export function EmptyContainer({
  containerType,
}: {
  containerType: containerType;
}) {
  const type = getContainerPlotTypePositions(containerType);
  if (type) {
    return (
      <ContainerSVG maxPosition={type.maxPos} isSquare={type.isSquare}>
        {range(1, type.maxPos + 1).map((n) => {
          const position = type.computePos(n);

          return (
            <SampleSVG
              clickableContainer={false}
              position={position}
              n={n}
              collected={false}
              selected={false}
            ></SampleSVG>
          );
        })}
      </ContainerSVG>
    );
  }
  return <></>;
}

function ContainerSVG({
  maxPosition,
  isSquare,
  children,
  onContainerClick = undefined,
}: PropsWithChildren<{
  maxPosition: number;
  isSquare: boolean;
  onContainerClick?: () => void;
}>) {
  const squareSize = 0.9;
  return (
    <svg
      style={{ maxWidth: 200 }}
      viewBox={`-5 -5 ${2 * containerRadius + 10} ${2 * containerRadius + 10}`}
    >
      {isSquare ? (
        <rect
          onClick={onContainerClick}
          x={0 + (1 - squareSize) * containerRadius}
          y={0 + (1 - squareSize) * containerRadius}
          width={2 * squareSize * containerRadius}
          height={2 * squareSize * containerRadius}
          fill="#CCCCCC"
          className={onContainerClick ? 'puck-clickable' : 'puck'}
          rx="5"
        ></rect>
      ) : (
        <circle
          onClick={onContainerClick}
          className={onContainerClick ? 'puck-clickable' : 'puck'}
          cx={containerRadius}
          cy={containerRadius}
          r={containerRadius}
          fill="#CCCCCC"
        ></circle>
      )}
      {maxPosition === 16 && (
        <g fill="#888888" stroke="#888888" pointer-events="none">
          <circle
            cx={containerRadius}
            cy={containerRadius * 1.05}
            r={containerRadius * 0.1}
          ></circle>
          <circle
            cx={containerRadius * 0.9}
            cy={containerRadius * 0.95}
            r={containerRadius * 0.05}
            stroke-width="1"
          ></circle>
          <circle
            cx={containerRadius * 1.1}
            cy={containerRadius * 0.95}
            r={containerRadius * 0.05}
            stroke-width="1"
          ></circle>
          <circle
            cx={containerRadius}
            cy={containerRadius * 1.5}
            r={containerRadius * 0.05}
            stroke-width="1"
          ></circle>
        </g>
      )}
      {children}
    </svg>
  );
}

function SampleSVG({
  position,
  n,
  refSample,
  collected,
  selected,
  onClick = undefined,
  clickableContainer,
}: {
  position: { x: string | number; y: string | number };
  n: number;
  refSample?: Sample;
  collected: boolean;
  selected: boolean;
  onClick?: () => void;
  clickableContainer: boolean;
}) {
  if (refSample) {
    const type = collected
      ? selected
        ? 'sampleCollectedSelected'
        : 'sampleCollected'
      : 'sampleFilled';
    const className = onClick ? type + ' sample-clickable' : type;

    const sampleCircle = (
      <circle
        pointerEvents={clickableContainer ? 'none' : undefined}
        onClick={onClick}
        className={className}
        cx={position.x}
        cy={position.y}
        r={containerRadius * 0.175}
      ></circle>
    );
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
          {sampleCircle}
        </OverlayTrigger>
        <text className={type} x={position.x} y={position.y}>
          <tspan dx="0" dy="3" pointer-events="none">
            {n}
          </tspan>
        </text>
      </>
    );
  }
  return (
    <>
      <circle
        pointerEvents={'none'}
        className="sampleEmpty"
        cx={position.x}
        cy={position.y}
        r={containerRadius * 0.175}
      ></circle>
      <text x={position.x} y={position.y} className="sampleEmpty">
        <tspan dx="0" dy="3" pointer-events="none">
          {n}
        </tspan>
      </text>
    </>
  );
}
