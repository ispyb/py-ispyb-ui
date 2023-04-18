import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import {
  getBeamline,
  getContainerType,
  getSampleChanger,
} from 'legacy/helpers/mx/samplehelper';
import { useMXContainers } from 'legacy/hooks/ispyb';
import _ from 'lodash';
import { range } from 'lodash';
import { containerType } from 'legacy/models';
import { PropsWithChildren } from 'react';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Sample } from '../model';
import './mxcontainer.scss';
import { useBeamlinesObjects } from 'legacy/hooks/site';

const containerRadius = 75;

export function MXContainer({
  proposalName,
  sessionId,
  containerId,
  containerType,
  selectedSamples = [],
  showInfo = true,
  onContainerClick = undefined,
  onSampleClick,
}: {
  proposalName: string;
  sessionId?: string;
  containerId: string;
  containerType?: containerType;
  showInfo?: boolean;
  onContainerClick?: () => void;
  selectedSamples?: string[];
  onSampleClick?: (sample: Sample) => void;
}) {
  const { data: samples, isError: isErrorContainer } = useMXContainers({
    proposalName,
    containerIds: [containerId],
  });
  if (isErrorContainer) throw Error(isErrorContainer);
  const sampleByPosition = _(samples)
    .groupBy((s) => s.BLSample_location)
    .value();

  const beamlines = useBeamlinesObjects('MX');
  const beamline =
    samples && samples.length
      ? getBeamline(beamlines, samples[0].Container_beamlineLocation)
      : undefined;
  const changer = getSampleChanger(beamline?.sampleChangerType);
  const pos =
    samples && samples.length
      ? changer?.getPosition(Number(samples[0].Container_sampleChangerLocation))
      : undefined;

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

          let collected: 0 | Sample[] = _(sampleArray)
            .filter((s) => !sessionId || Number(sessionId) === s?.sessionId)
            .filter(
              (s) =>
                s?.DataCollectionGroup_dataCollectionGroupId !== null &&
                s?.DataCollectionGroup_dataCollectionGroupId !== undefined
            )
            .value();

          const refSample =
            collected && collected.length
              ? collected[0]
              : sampleArray && sampleArray.length
              ? sampleArray[0]
              : undefined;

          const sampleName = refSample?.BLSample_name;

          const selected = sampleName && selectedSamples.includes(sampleName);

          const onClick = () => {
            if (refSample && onSampleClick) {
              onSampleClick(refSample);
            }
          };

          return (
            <SampleSVG
              key={n}
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
                value: pos
                  ? `cell ${pos.cell + 1} pos ${pos.position + 1}`
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
              key={n}
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
        <g fill="#888888" stroke="#888888" pointerEvents="none">
          <circle
            cx={containerRadius}
            cy={containerRadius * 1.05}
            r={containerRadius * 0.1}
          ></circle>
          <circle
            cx={containerRadius * 0.9}
            cy={containerRadius * 0.95}
            r={containerRadius * 0.05}
            strokeWidth="1"
          ></circle>
          <circle
            cx={containerRadius * 1.1}
            cy={containerRadius * 0.95}
            r={containerRadius * 0.05}
            strokeWidth="1"
          ></circle>
          <circle
            cx={containerRadius}
            cy={containerRadius * 1.5}
            r={containerRadius * 0.05}
            strokeWidth="1"
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
        cursor={onClick && !clickableContainer ? 'pointer' : undefined}
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
          <tspan dx="0" dy="5" pointerEvents="none">
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
        <tspan dx="0" dy="5" pointerEvents="none">
          {n}
        </tspan>
      </text>
    </>
  );
}
