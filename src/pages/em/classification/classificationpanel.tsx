import React from 'react';
import { Card } from 'react-bootstrap';
import { Classification } from 'pages/em/model';
import { getClassificationThumbnail } from 'api/ispyb';
import ImageZoom from 'components/image/zoomimage';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { convertToFixed } from 'helpers/numerictransformation';

interface Props {
  classification: Classification;
  proposalName: string;
}
export default function ClassificationPanel({ classification, proposalName }: Props) {
  const { particleClassificationId, classDistribution, estimatedResolution, classNumber } = classification;
  return (
    <Card>
      <Card.Header># Class {classNumber}</Card.Header>
      <Card.Body>
        <ImageZoom alt="Classification" src={getClassificationThumbnail({ proposalName, particleClassificationId }).url} />
        <Card.Text>
          <SimpleParameterTable
            parameters={[
              {
                key: 'Class Dis',
                value: convertToFixed(classDistribution, 2),
              },
              {
                key: 'Resolution',
                value: convertToFixed(estimatedResolution, 2),
              },
            ]}
          ></SimpleParameterTable>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
