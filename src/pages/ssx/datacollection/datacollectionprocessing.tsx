import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SSXDataCollectionResponse } from '../model';

export default function SSXDataCollectionProcessing({ dc }: { dc: SSXDataCollectionResponse }) {
  return (
    <div style={{ height: 150, textAlign: 'center' }}>
      <p>TODO: Processing</p>
      <FontAwesomeIcon icon={faQuestionCircle} style={{ marginRight: 10 }} />
    </div>
  );
}
