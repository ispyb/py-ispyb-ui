import { DataCollectionGroup } from 'legacy/pages/mx/model';
import UI from 'legacy/config/ui';
import { Col, Row } from 'react-bootstrap';
import ZoomImage from 'legacy/components/image/zoomimage';
import { getCrystalImage } from 'legacy/api/ispyb';
import { useParams } from 'react-router-dom';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { MXContainer } from 'legacy/pages/mx/container/mxcontainer';
import LoadingPanel from 'legacy/components/loading/loadingpanel';
import { Suspense } from 'react';

type Param = {
  proposalName: string;
  sessionId: string;
};

export default function SampleDataCollectionGroupPanel({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  const { proposalName = '', sessionId = '' } = useParams<Param>();

  const {
    Protein_acronym,
    BLSample_name,
    Shipping_shippingName,
    Dewar_code,
    Container_code,
    BLSample_location,
    Container_beamlineLocation,
    Container_sampleChangerLocation,
  } = dataCollectionGroup;

  return (
    <Row>
      <Col xs={12} sm={12} md={4}>
        <SimpleParameterTable
          parameters={[
            { key: 'Protein', value: Protein_acronym },
            { key: 'Sample', value: BLSample_name },
            { key: 'Shipment', value: Shipping_shippingName },
            { key: 'Parcel', value: Dewar_code },
            {
              key: 'Container / Position',
              value: `${Container_code}/${BLSample_location}`,
            },
            { key: 'Beamline location', value: Container_beamlineLocation },
            {
              key: 'Sample Changer Location',
              value: Container_sampleChangerLocation,
            },
          ]}
        ></SimpleParameterTable>
      </Col>
      <Col xs={12} sm={6} md={true}>
        {UI.MX.showCrystalSnapshot1 && (
          <ZoomImage
            alt="Crystal 1"
            src={
              getCrystalImage({
                proposalName,
                dataCollectionId:
                  dataCollectionGroup.DataCollection_dataCollectionId,
                imageIndex: 1,
              }).url
            }
          />
        )}
      </Col>
      <Col xs={12} sm={6} md={true}>
        {UI.MX.showCrystalSnapshot2 && (
          <ZoomImage
            alt="Crystal 2"
            src={
              getCrystalImage({
                proposalName,
                dataCollectionId:
                  dataCollectionGroup.DataCollection_dataCollectionId,
                imageIndex: 2,
              }).url
            }
          />
        )}
      </Col>
      <Col xs={12} sm={6} md={true}>
        {UI.MX.showCrystalSnapshot3 && (
          <ZoomImage
            alt="Crystal 3"
            src={
              getCrystalImage({
                proposalName,
                dataCollectionId:
                  dataCollectionGroup.DataCollection_dataCollectionId,
                imageIndex: 3,
              }).url
            }
          />
        )}
      </Col>
      <Col xs={12} sm={6} md={true}>
        {UI.MX.showCrystalSnapshot4 && (
          <ZoomImage
            alt="Crystal 4"
            src={
              getCrystalImage({
                proposalName,
                dataCollectionId:
                  dataCollectionGroup.DataCollection_dataCollectionId,
                imageIndex: 4,
              }).url
            }
          />
        )}
      </Col>
      <Col xs={12} sm={6} md={true}>
        {dataCollectionGroup.Container_containerId && (
          <Suspense fallback={<LoadingPanel></LoadingPanel>}>
            <MXContainer
              selectedGroups={[
                dataCollectionGroup.DataCollection_dataCollectionGroupId || 0,
              ]}
              containerId={String(dataCollectionGroup.Container_containerId)}
              sessionId={sessionId}
              proposalName={proposalName}
            ></MXContainer>{' '}
          </Suspense>
        )}
      </Col>
    </Row>
  );
}
