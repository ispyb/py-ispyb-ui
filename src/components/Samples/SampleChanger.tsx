import { useState } from 'react';
import { useSuspense } from 'rest-hooks';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

import { SampleResource } from 'api/resources/Sample';
import { usePath } from 'hooks/usePath';
import { useSessionInfo } from 'hooks/useSessionInfo';
import { getColors } from 'utils/colours';
import { getSampleState } from './SampleStatus';

interface ISampleChanger {
  beamLineName?: string;
}

export default function SampleChanger(props: ISampleChanger) {
  const sessionId = usePath('sessionId');
  const proposal = usePath('propoal');
  const sessionInfo = useSessionInfo(sessionId);
  const [selectedAcronym, setSelectedAcronym] = useState<string>('');

  const samples = useSuspense(SampleResource.list(), {
    skip: 0,
    limit: 9999,
    assigned: true,
    beamLineName: sessionId ? sessionInfo.beamLineName : props.beamLineName,
    ...(sessionId ? { proposal: sessionInfo.proposal } : null),
  });

  const changerPositions = Array(15).fill(0);
  const containerPositions = Array(16).fill(0);

  const proteinAcronyms: string[] = [
    // @ts-ignore
    ...new Set(samples.results.map((sample) => sample.Crystal.Protein.acronym)),
  ];
  const proteinColours = Object.fromEntries(
    getColors(proteinAcronyms.length).map((color, i) => [
      proteinAcronyms[i],
      color,
    ])
  );

  const containers: Record<string, Record<number, string>> = {};
  samples.results.forEach((sample) => {
    if (sample.Container && sample.Container.sampleChangerLocation) {
      if (!(sample.Container?.sampleChangerLocation in containers)) {
        containers[sample.Container.sampleChangerLocation] = {};
      }

      if (sample.containerId) {
        containers[sample.Container.sampleChangerLocation][sample.containerId] =
          sample.Container.code;
      }
    }
  });

  function getSample(changerPosition: number, containerPositon: number) {
    const relevantSamples = samples.results.filter(
      (sample) =>
        // @ts-ignore
        sample.Container.sampleChangerLocation ===
          String(changerPosition + 1) &&
        sample.location === containerPositon + 1
    );

    if (relevantSamples.length) {
      const sample = relevantSamples[0];
      const state = getSampleState(sample);
      const badgeSize = 20;

      const renderProtein = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
          Protein: {sample.Crystal.Protein.acronym}
          <br />
          Sample: {sample.name}
        </Tooltip>
      );

      const renderState = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
          {state && state.state}
          {!state && <span className="text-italic">No action yet</span>}
        </Tooltip>
      );
      return (
        <div>
          <Link to={`/proposals/${proposal}/samples/${sample.blSampleId}`}>
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderProtein}
            >
              <div
                className={`d-inline-block border rounded ${
                  selectedAcronym === sample.Crystal.Protein.acronym
                    ? 'border-dark'
                    : 'border-light'
                }`}
                onMouseEnter={() =>
                  setSelectedAcronym(sample.Crystal.Protein.acronym)
                }
                onMouseLeave={() => setSelectedAcronym('')}
                style={{
                  cursor: 'pointer',
                  width: badgeSize,
                  height: badgeSize,
                  backgroundColor:
                    proteinColours[sample.Crystal.Protein.acronym],
                }}
              />
            </OverlayTrigger>
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderState}
            >
              <div
                className="d-inline-block border rounded"
                style={{
                  width: badgeSize,
                  height: badgeSize,
                  ...(state ? { backgroundColor: state.color } : null),
                }}
              />
            </OverlayTrigger>
          </Link>
        </div>
      );
    }

    return null;
  }

  const colWidth = `${100 / (changerPositions.length + 1)}%`;

  return (
    <section>
      <h1>Sample Changer</h1>

      {sessionId && (
        <ul>
          <li>Start Date: {sessionInfo.startDate}</li>
          <li>Session: {sessionInfo.session}</li>
          <li>Beamline: {sessionInfo.beamLineName}</li>
        </ul>
      )}

      <div className="d-flex">
        <div style={{ flex: colWidth }}></div>
        {changerPositions.map((_, changerPosition) => (
          <div style={{ flex: colWidth }}>
            <h2>
              {changerPosition + 1}{' '}
              {containers[changerPosition + 1] &&
                Object.values(containers[String(changerPosition + 1)]).length >
                  1 && <ExclamationTriangleFill color="#ffc107" />}
            </h2>
            {containers[changerPosition + 1] &&
              Object.entries(containers[changerPosition + 1]).map(
                ([_, code]) => <div className="text-break">{code}</div>
              )}
          </div>
        ))}
      </div>
      {containerPositions.map((_, containerPositon) => (
        <div className="d-flex">
          <div style={{ flex: colWidth }}>{containerPositon + 1}</div>
          {changerPositions.map((_, changerPosition) => (
            <div style={{ flex: colWidth }}>
              {getSample(changerPosition, containerPositon)}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
