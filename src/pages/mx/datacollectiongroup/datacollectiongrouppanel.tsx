import React from 'react';
import { Card, Tabs, Tab } from 'react-bootstrap';
import { DataCollectionGroup } from 'pages/mx/model';
import SummaryDataCollectionGroupPanel from 'pages/mx/datacollectiongroup/summarydatacollectiongroup/summarydatacollectiongrouppanel';
import BeamlineDataCollectionGroupPanel from 'pages/mx/datacollectiongroup/beamline/beamlinedatacollectiongrouppanel';
import './style.css';

type Props = {
  sessionId: string;
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
};

export default function DataCollectionGroupPanel({ proposalName, dataCollectionGroup }: Props) {
  return (
    <>
      <Tabs defaultActiveKey="Summary" id="tabs-datacollectiongroup-panel">
        <Tab eventKey="Summary" title="Summary">
          <Card>
            <SummaryDataCollectionGroupPanel proposalName={proposalName} dataCollectionGroup={dataCollectionGroup}></SummaryDataCollectionGroupPanel>
          </Card>
        </Tab>
        <Tab eventKey="Beamline" title="Beamline Parameters">
          <BeamlineDataCollectionGroupPanel dataCollectionGroup={dataCollectionGroup}></BeamlineDataCollectionGroupPanel>
        </Tab>
        <Tab eventKey="Data" title="Data Collections"></Tab>
        <Tab eventKey="Sample" title="Sample"></Tab>
        <Tab eventKey="Results" title="Results"></Tab>
        <Tab eventKey="Workflow" title="Workflow"></Tab>
      </Tabs>
    </>
  );
}
