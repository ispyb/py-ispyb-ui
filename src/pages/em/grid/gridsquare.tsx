import { Image, Badge, ProgressBar, Button, Card } from 'react-bootstrap';
import Zoom from 'react-medium-image-zoom';
import React from 'react';
import { getCrystalImage } from 'api/ispyb';
import 'react-medium-image-zoom/dist/styles.css';
import 'pages/em/styles.scss';
import { useNavigate } from 'react-router';

export default function GridSquare({
  startTime,
  proposalName,
  dataCollectionId,
  movieCount,
  progressMotionCor,
  progressCtf,
}: {
  startTime: string;
  proposalName: string;
  dataCollectionId: number;
  movieCount: number;
  progressMotionCor: number;
  progressCtf: number;
}) {
  const navigate = useNavigate();
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
        <Button variant="primary" onClick={() => navigate(`/${proposalName}/EM/${dataCollectionId}/movies`)}>
          Open
        </Button>
      </Card.Body>
    </Card>
  );
}
