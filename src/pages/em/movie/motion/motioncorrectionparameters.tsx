import React from 'react';
import { Table } from 'react-bootstrap';
import { Movie } from 'pages/em/model';
import SimpleParameterTable from 'components/table/simpleparametertable';

const expo = (x: string, f: number): string => {
  return Number.parseFloat(x).toExponential(f);
};

interface Props {
  dataCollectionId: number;
  proposalName: string;
  movie: Movie;
}
export default function Motion(props: Props) {
  const { MotionCorrection_totalMotion, MotionCorrection_averageMotionPerFrame, MotionCorrection_lastFrame, MotionCorrection_dosePerFrame, Movie_positionX, Movie_positionY } =
    props.movie;
  return (
    <>
      <Table>
        <tbody>
          <tr>
            <td colSpan={2}>Position</td>
          </tr>
          <tr>
            <td>X: {expo(Movie_positionX, 3)}</td>
            <td>Y: {expo(Movie_positionY, 3)}</td>
          </tr>
        </tbody>
      </Table>
      <SimpleParameterTable
        parameters={[
          { key: 'Total Motion', value: MotionCorrection_totalMotion },
          { key: 'Avg. Motion/frame', value: MotionCorrection_averageMotionPerFrame },
          { key: 'Frame Range', value: MotionCorrection_lastFrame },
          { key: 'Dose', value: MotionCorrection_dosePerFrame },
        ]}
      ></SimpleParameterTable>
    </>
  );
}
