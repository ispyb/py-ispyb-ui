import React from 'react';
import { Card, Tabs, Tab } from 'react-bootstrap';

import { DataCollectionGroup } from 'pages/mx/model';
import SummaryDataCollectionGroupPanel from 'pages/mx/datacollectiongroup/summarydatacollectiongroup/summarydatacollectiongrouppanel';
import BeamlineDataCollectionGroupPanel from 'pages/mx/datacollectiongroup/beamline/beamlinedatacollectiongrouppanel';
import './datacollectiongrouppanel.css';

type Props = {
  sessionId: string;
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
};

export default function DataCollectionGroupPanel({ proposalName, dataCollectionGroup }: Props) {
  return (
    <>
      <Tabs defaultActiveKey="Summary" className="tabs-datacollectiongroup-panel">
        <Tab eventKey="Summary" title="Summary">
          <Card>
            <SummaryDataCollectionGroupPanel proposalName={proposalName} dataCollectionGroup={dataCollectionGroup}></SummaryDataCollectionGroupPanel>
          </Card>
        </Tab>
        <Tab eventKey="Beamline" title="Beamline Parameters">
          <Card>
            <BeamlineDataCollectionGroupPanel dataCollectionGroup={dataCollectionGroup}></BeamlineDataCollectionGroupPanel>
          </Card>
        </Tab>
        <Tab eventKey="Data" title="Data Collections">
          <Card>
            <p>TODO</p>
          </Card>
        </Tab>
        <Tab eventKey="Sample" title="Sample">
          <Card>
            <p>TODO</p>
          </Card>
        </Tab>
        <Tab eventKey="Results" title="Results">
          <Card>
            <p>TODO</p>
          </Card>
        </Tab>
        <Tab eventKey="Workflow" title="Workflow">
          <Card>
            <p>TODO</p>
          </Card>
        </Tab>
      </Tabs>
    </>
  );
}
