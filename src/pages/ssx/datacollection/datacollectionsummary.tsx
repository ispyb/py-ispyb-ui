import { Col, Row } from 'react-bootstrap';
import { Suspense } from 'react';
import LoadingPanel from 'components/loading/loadingpanel';
import ZoomImage from 'components/image/zoomimage';
import { DataCollection } from 'models/Event';
import LazyWrapper from 'components/loading/lazywrapper';
import { HitsStatistics } from '../statistics/hits';
import { UnitCellStatistics } from '../statistics/cells';

export default function SSXDataCollectionSummary({ dc }: { dc: DataCollection }) {
  return (
    <Row className="flex-nowrap" style={{ overflowX: 'auto' }}>
      <Col md={'auto'}>
        <ZoomImage style={{ maxWidth: 350 }} src="/images/temp/max.png"></ZoomImage>
      </Col>
      <Col md={'auto'}>
        <Suspense fallback={<LoadingPanel></LoadingPanel>}>
          <HitsStatistics dc={dc}></HitsStatistics>
        </Suspense>
      </Col>
      <Col md={'auto'}>
        <ZoomImage style={{ maxWidth: 400 }} src="/images/temp/dozor.png"></ZoomImage>
      </Col>
      <Col md={'auto'}>
        <LazyWrapper>
          <Suspense fallback={<LoadingPanel></LoadingPanel>}>
            <UnitCellStatistics dcIds={[dc.dataCollectionId]}></UnitCellStatistics>
          </Suspense>
        </LazyWrapper>
      </Col>
    </Row>
  );
}
