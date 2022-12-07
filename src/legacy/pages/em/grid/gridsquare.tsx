import { Badge, ProgressBar, Button, Card } from 'react-bootstrap';
import React from 'react';
import { getCrystalImage } from 'legacy/api/ispyb';
import 'react-medium-image-zoom/dist/styles.css';
import 'legacy/pages/em/styles.scss';
import { Link } from 'react-router-dom';
import ZoomImage from 'legacy/components/image/zoomimage';

export default function GridSquare({
  startTime,
  proposalName,
  dataCollectionId,
  movieCount,
  progressMotionCor,
  progressCtf,
  sessionId,
}: {
  startTime: string;
  proposalName: string;
  dataCollectionId: number;
  movieCount: number;
  progressMotionCor: number;
  progressCtf: number;
  sessionId: string;
}) {
  return (
    <Card style={{ width: '18rem' }}>
      <ZoomImage
        src={
          getCrystalImage({ proposalName, dataCollectionId, imageIndex: 1 }).url
        }
      />
      <Card.Body>
        <Card.Title>
          {' '}
          N<sup>o</sup> movies:
          <Badge style={{ marginLeft: '10px' }}>{movieCount}</Badge>
          <p>{startTime}</p>
        </Card.Title>
        <Card.Text>
          <p>
            <ProgressBar
              style={{ height: 25 }}
              variant="success"
              now={progressMotionCor}
              label={`Motion corr: ${progressMotionCor}%`}
            />
          </p>
          <ProgressBar
            style={{ height: 25 }}
            variant="success"
            now={progressCtf}
            label={`CTF: ${progressCtf}%`}
          />
        </Card.Text>
        <Link
          to={`/legacy/proposals/${proposalName}/EM/${sessionId}/${dataCollectionId}/movies`}
        >
          <Button variant="primary">Open</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
