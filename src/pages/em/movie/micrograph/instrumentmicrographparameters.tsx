import React from 'react';
import { Movie } from 'pages/em/model';
import SimpleParameterTable from 'components/table/simpleparametertable';

interface Props {
  dataCollectionId: number;
  proposalName: string;
  movie: Movie;
}
export default function InstrumentMicrographParameters(props: Props) {
  const { Movie_movieNumber, Movie_createdTimeStamp, Movie_fileName, MotionCorrection_averageMotionPerFrame, CTF_resolutionLimit } = props.movie;
  return (
    <SimpleParameterTable
      parameters={[
        { key: 'Number', value: Movie_movieNumber },
        { key: 'Time', value: Movie_createdTimeStamp },
        { key: 'Movie File Name', value: Movie_fileName },
        { key: 'Average motion/frame', value: MotionCorrection_averageMotionPerFrame },
        { key: 'Resolution', value: CTF_resolutionLimit },
      ]}
    ></SimpleParameterTable>
  );
}
