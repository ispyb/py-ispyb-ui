import { Col, Row } from 'react-bootstrap';
import { Suspense } from 'react';
import LightBox from 'components/LightBox';
import { Event } from 'models/Event';
import { LazyImage } from 'api/resources/XHRFile';
import Loading from 'components/Loading';
import { HitsStatisticsCumulative } from './statistics/hits';
import { UnitCellStatistics } from './statistics/cells';

export default function SSXDataCollectionDetail({ dc }: { dc: Event }) {
  return (
    <Row className="flex-nowrap" style={{ overflowX: 'auto' }}>
      <Col md={'auto'}>
        <LightBox local images={['/images/temp/max.png']}>
          <LazyImage
            style={{ maxWidth: 340 }}
            local
            src="/images/temp/max.png"
          />
        </LightBox>
      </Col>
      <Col md={'auto'}>
        <Suspense fallback={<Loading />}>
          <HitsStatisticsCumulative dcs={[dc]}></HitsStatisticsCumulative>
        </Suspense>
      </Col>
      <Col md={'auto'}>
        <LightBox local images={['/images/temp/dozor.png']}>
          <LazyImage
            style={{ maxWidth: 400 }}
            local
            src="/images/temp/dozor.png"
          />
        </LightBox>
      </Col>
      <Col md={'auto'}>
        <Suspense fallback={<Loading />}>
          <UnitCellStatistics dcs={[dc]}></UnitCellStatistics>
        </Suspense>
      </Col>
    </Row>
  );
}
