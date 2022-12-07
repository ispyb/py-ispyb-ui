import React from 'react';
import GridSquarePanel from 'legacy/pages/em/grid/gridsquarepanel';

const l = { title: 'GridSquarePanel', component: GridSquarePanel };
export default l;

const data = {
  sampleName: 'g2',
  proposalName: 'MX2381',
  gridSquaresCount: 9,
  totalNumberOfMovies: 7220,
  noFrames: 50,
  voltage: 300000,
  grids: [
    {
      progressMotionCor: 100,
      progressCtf: 100,
      url: '/sessions/em/proposal/{proposalName}/datacollection/2714866/movies',
      dataCollectionId: 2714866,
      startTime: '2022-01-17 14:49:38',
      movieCount: 948,
    },
    {
      progressMotionCor: 100,
      progressCtf: 100,
      url: '/sessions/em/proposal/{proposalName}/datacollection/2714870/movies',
      dataCollectionId: 2714870,
      startTime: '2022-01-17 17:21:14',
      movieCount: 924,
    },
  ],
  magnification: 105000,
  samplingRate: 0.42,
};
const Story = (args) => <GridSquarePanel {...args} />;

export const MyGridSquarePanelHeader = Story.bind({});
MyGridSquarePanelHeader.args = {
  sampleList: data,
};
