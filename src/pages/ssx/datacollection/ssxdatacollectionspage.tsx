import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSSXDataCollections } from 'hooks/pyispyb';
import Page from 'pages/page';
import { Alert, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SSXDataCollectionPane from './ssxdatacollectionpane';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function SSXDataCollectionsPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();

  const { data, isError } = useSSXDataCollections(sessionId);

  if (isError) throw Error(isError);

  let content;

  if (data && data.length) {
    content = (
      <Card>
        {data.map((dc) => (
          <SSXDataCollectionPane dc={dc}></SSXDataCollectionPane>
        ))}
      </Card>
    );
  } else {
    content = (
      <Alert variant="info">
        <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 10 }} />
        No data found.
      </Alert>
    );
  }

  return <Page selected="sessions">{content}</Page>;
}
