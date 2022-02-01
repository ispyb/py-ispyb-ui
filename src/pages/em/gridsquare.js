import { Image, Badge, ProgressBar, Button, Card } from 'react-bootstrap';
import Zoom from 'react-medium-image-zoom';
import React from 'react';
import { getCrystalImage } from 'api/ispyb.js';
import 'react-medium-image-zoom/dist/styles.css';
import 'pages/em/styles.css';

export default function GridSquare({ startTime, proposalName, dataCollectionId, movieCount, progressMotionCor, progressCtf }) {
  return (
    <Card style={{ width: '18rem' }}>
      <Zoom>
        <Image rounded thumbnail src={getCrystalImage({ proposalName, dataCollectionId, imageIndex: 1 }).url} />
      </Zoom>
      <Card.Body>
        <Card.Title>
          {' '}
          N<sup>o</sup> movies:
          <Badge style={{ marginLeft: '10px' }}>{movieCount}</Badge>
          <p>{startTime}</p>
        </Card.Title>
        <Card.Text>
          <p>
            <ProgressBar style={{ height: 25 }} variant="success" now={progressMotionCor} label={`Motion corr: ${progressMotionCor}%`} />
          </p>
          <ProgressBar style={{ height: 25 }} variant="success" now={progressCtf} label={`CTF: ${progressCtf}%`} />
        </Card.Text>
        <Button variant="primary">Open</Button>
      </Card.Body>
    </Card>
  );
}
