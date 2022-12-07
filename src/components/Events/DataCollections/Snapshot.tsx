import { LazyImage } from 'api/resources/XHRFile';
import LightBox from 'components/LightBox';
import { DataCollection as DataCollectionType, Event } from 'models/Event.d';
import { Link } from 'react-router-dom';

export default function Snapshot({ item }: { item: DataCollectionType }) {
  return (
    <>
      {item._metadata.snapshots[1] && (
        <LightBox
          images={Object.entries(item._metadata.snapshots)
            .map(([snapshotId, available]) =>
              available && snapshotId !== 'analysis'
                ? `/datacollections/images/${item.dataCollectionId}?imageId=${snapshotId}`
                : ''
            )
            .filter((image) => !!image)}
        >
          <LazyImage
            className="img-fluid"
            src={`/datacollections/images/${item.dataCollectionId}?snapshot=true`}
            alt="Sample snapshot 1"
          />
        </LightBox>
      )}
    </>
  );
}

export function DiffractionSnapshot({
  parent,
  item,
}: {
  parent: Event;
  item: DataCollectionType;
}) {
  return (
    <>
      <Link
        to={`/proposals/${parent.proposal}/sessions/${parent.sessionId}/images/${item.dataCollectionId}`}
      >
        <LazyImage
          className="img-fluid"
          src={`/datacollections/images/diffraction/${item.dataCollectionId}?snapshot=true`}
          alt="Diffraction Image"
        />
      </Link>
    </>
  );
}

export function PerImageSnapshot({ item }: { item: DataCollectionType }) {
  return (
    <>
      {item._metadata.snapshots.analysis && (
        <LightBox
          images={[`/datacollections/images/quality/${item.dataCollectionId}`]}
        >
          <LazyImage
            className="img-fluid"
            src={`/datacollections/images/quality/${item.dataCollectionId}`}
            alt="Per Image Anaylsis"
          />
        </LightBox>
      )}
    </>
  );
}
