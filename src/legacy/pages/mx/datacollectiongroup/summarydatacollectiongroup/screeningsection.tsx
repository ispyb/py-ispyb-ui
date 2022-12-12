import { DataCollectionGroup } from 'legacy/pages/mx/model';
import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import UnitCellSection from './unitcellsection';

import './screeningsection.scss';

function getSuccessIndexing(datacollectiongroup: DataCollectionGroup) {
  if (datacollectiongroup.ScreeningOutput_indexingSuccess) {
    return <div className="summary_datacollection_success"> </div>;
  }
  return <div className="summary_datacollection_failed"></div>;
}

function getUnitCellSection(datacollectiongroup: DataCollectionGroup) {
  if (datacollectiongroup.ScreeningOutput_strategySuccess) {
    return (
      <UnitCellSection
        cell_a={String(datacollectiongroup.ScreeningOutputLattice_unitCell_a)}
        cell_b={String(datacollectiongroup.ScreeningOutputLattice_unitCell_b)}
        cell_c={String(datacollectiongroup.ScreeningOutputLattice_unitCell_c)}
        cell_alpha={String(
          datacollectiongroup.ScreeningOutputLattice_unitCell_alpha
        )}
        cell_beta={String(
          datacollectiongroup.ScreeningOutputLattice_unitCell_beta
        )}
        cell_gamma={String(
          datacollectiongroup.ScreeningOutputLattice_unitCell_gamma
        )}
      ></UnitCellSection>
    );
  }
}

function getRankingResolution(datacollectiongroup: DataCollectionGroup) {
  if (datacollectiongroup.ScreeningOutput_strategySuccess) {
    return (
      <tr>
        <td colSpan={2}>Rank. Res.</td>
        <td colSpan={2}>
          <span style={{ fontWeight: 'bold' }}>
            {datacollectiongroup.ScreeningOutput_rankingResolution} &#8491;
          </span>
        </td>
      </tr>
    );
  }
}

function getStrategyOsc(datacollectiongroup: DataCollectionGroup) {
  if (datacollectiongroup.ScreeningOutput_strategySuccess) {
    return (
      <tr>
        <td colSpan={2}>Osc. start (total)</td>
        <td colSpan={2}>
          <span style={{ fontWeight: 'bold' }}>
            {datacollectiongroup.ScreeningStrategySubWedge_axisStart} &deg; (
            {datacollectiongroup.ScreeningOutput_totalRotationRange} &deg;)
          </span>
        </td>
      </tr>
    );
  }
}

export default function ScreeningSection({
  dataCollectionGroup,
  compact,
}: {
  dataCollectionGroup: DataCollectionGroup;
  compact: boolean;
}) {
  const content = [
    <Col>
      <Table responsive className="parameterKey" style={{ marginBottom: 0 }}>
        <tbody>
          <Indexed dataCollectionGroup={dataCollectionGroup}></Indexed>
          <StrategyHeader
            dataCollectionGroup={dataCollectionGroup}
          ></StrategyHeader>
        </tbody>
      </Table>
    </Col>,
    <Col>
      <Table responsive className="parameterKey" style={{ marginBottom: 0 }}>
        <tbody>
          {getRankingResolution(dataCollectionGroup)}
          {getStrategyOsc(dataCollectionGroup)}
          <StrategyImages
            dataCollectionGroup={dataCollectionGroup}
          ></StrategyImages>
        </tbody>
      </Table>
    </Col>,
    <Col>
      <Table responsive className="parameterKey">
        <tbody>
          <StrategyOscRange
            dataCollectionGroup={dataCollectionGroup}
          ></StrategyOscRange>

          <StrategyTransmission
            dataCollectionGroup={dataCollectionGroup}
          ></StrategyTransmission>
          <StrategyExpTime
            dataCollectionGroup={dataCollectionGroup}
          ></StrategyExpTime>
        </tbody>
      </Table>
    </Col>,
    <Col>{getUnitCellSection(dataCollectionGroup)}</Col>,
  ];
  return compact ? <Row>{content}</Row> : <Col>{content}</Col>;
}

function Indexed({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  return (
    <tr>
      <td>
        <span>Indexed</span>
      </td>
      <td>{getSuccessIndexing(dataCollectionGroup)}</td>
      <td>Mosaicity</td>
      <td className="parameterValue">
        {dataCollectionGroup.ScreeningOutput_mosaicity}
      </td>
    </tr>
  );
}

function StrategyHeader({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  if (dataCollectionGroup.ScreeningOutput_strategySuccess) {
    return (
      <tr>
        <td>
          <span>Strategy</span>
        </td>
        <td>
          <div className="summary_datacollection_success"></div>
        </td>
        <td>Space Group</td>
        <td className="parameterValue">
          {dataCollectionGroup.ScreeningOutputLattice_spaceGroup}
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td>
        <span>Strategy</span>
      </td>
      <td>
        <div className="summary_datacollection_failed"></div>
      </td>
    </tr>
  );
}

function StrategyImages({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  if (dataCollectionGroup.ScreeningOutput_strategySuccess) {
    return (
      <tr>
        <td colSpan={2}>Images</td>
        <td colSpan={2} className="parameterValue">
          {dataCollectionGroup.ScreeningStrategySubWedge_numberOfImages}
        </td>
      </tr>
    );
  }
  return null;
}

function StrategyOscRange({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  if (dataCollectionGroup.ScreeningOutput_strategySuccess) {
    return (
      <tr>
        <td colSpan={2}>Osc. range</td>
        <td colSpan={2} className="parameterValue">
          {dataCollectionGroup.ScreeningStrategySubWedge_oscillationRange} &deg;
        </td>
      </tr>
    );
  }
  return null;
}

function StrategyTransmission({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  if (dataCollectionGroup.ScreeningOutput_strategySuccess) {
    return (
      <tr>
        <td colSpan={2}>Transmission</td>
        <td colSpan={2} className="parameterValue">
          {dataCollectionGroup.ScreeningStrategySubWedge_transmission} s
        </td>
      </tr>
    );
  }
  return null;
}

function StrategyExpTime({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  if (dataCollectionGroup.ScreeningOutput_strategySuccess) {
    return (
      <tr>
        <td colSpan={2}>Exp. Time</td>
        <td colSpan={2} className="parameterValue">
          {dataCollectionGroup.ScreeningStrategySubWedge_exposureTime} s
        </td>
      </tr>
    );
  }
  return null;
}
