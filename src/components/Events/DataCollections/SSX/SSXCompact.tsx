import { SSXDataCollectionProcessingStatsResource } from 'api/resources/SSX/SSXDataCollectionProcessingStats';
import { IMetadataItemProps, MetadataItem } from 'components/Events/Metadata';
import {
  getColorFromHitPercent,
  getColorFromIndexedPercent,
} from 'helpers/ssx';
import { round } from 'lodash';
import { DataCollection, Event } from 'models/Event';
import { Sample } from 'models/Sample';
import { Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { useSuspense } from 'rest-hooks';

export function CompactSSXContent({
  dcgItem,
  dcs,
  sample,
}: {
  dcgItem: DataCollection;
  dcs: Event[];
  sample: Sample;
}) {
  const fields: IMetadataItemProps[] = [
    { title: 'Protein', content: sample.Crystal.Protein.acronym },
    { title: 'Sample', content: sample.name },
    {
      title: 'Sample support',
      content: dcgItem.DataCollectionGroup.experimentType,
    },
    {
      title: 'Experiment name',
      content: dcgItem.SSXDataCollection?.experimentName,
    },
    { title: '# Runs', content: dcs.length },
  ];
  return (
    <Col>
      <Row>
        {fields.map((field) => (
          <Col key={field.title}>
            <MetadataItem {...field} />
          </Col>
        ))}
      </Row>
      <Row>
        {' '}
        <CompactSSXStats dcs={dcs}></CompactSSXStats>
      </Row>
    </Col>
  );
}

export function CompactSSXStats({ dcs }: { dcs: Event[] }) {
  const dcIds = dcs.map((v) => v.id);
  const data = useSuspense(SSXDataCollectionProcessingStatsResource.list(), {
    dataCollectionIds: dcIds,
  });
  const nbImages = dcs
    .map((dc) => {
      return 'DataCollectionGroup' in dc.Item && dc.Item.numberOfImages
        ? dc.Item.numberOfImages
        : 0;
    })
    .reduce((a, b) => a + b, 0);

  if (data === undefined || !data.length || !nbImages) {
    return <></>;
  }

  const nbHits = data.map((d) => d.nbHits).reduce((a, b) => a + b, 0);
  const nbIndexed = data.map((d) => d.nbIndexed).reduce((a, b) => a + b, 0);

  const indexedPercent = (nbIndexed / nbImages) * 100;
  const hitsPercent = (nbHits / nbImages) * 100;

  return (
    <Container>
      <ProgressBar>
        <ProgressBar
          label={`${nbIndexed.toLocaleString()} indexed (${round(
            indexedPercent,
            2
          )}%)`}
          style={{
            backgroundColor: getColorFromIndexedPercent(indexedPercent),
          }}
          now={indexedPercent}
          key={'indexed'}
        />
        <ProgressBar
          label={`${(
            nbHits - nbIndexed
          ).toLocaleString()} non-indexed hits (${round(
            hitsPercent - indexedPercent,
            2
          )}%)`}
          style={{ backgroundColor: getColorFromHitPercent(hitsPercent) }}
          now={hitsPercent - indexedPercent}
          key={'hits'}
        />
        <ProgressBar
          label={`${(
            nbImages - nbHits
          ).toLocaleString()} skipped images (${round(100 - hitsPercent, 2)}%)`}
          variant="primary"
          now={100 - hitsPercent}
          key={'images'}
        />
      </ProgressBar>
    </Container>
  );
}
