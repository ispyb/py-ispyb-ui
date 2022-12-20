import Filter from 'components/Filter';
import { useSchema } from 'hooks/useSpec';
import { Row, Col } from 'react-bootstrap';
import ComponentsEditor from './editor/ComponentsEditor';
import SamplesEditor from './editor/SamplesEditor';

export default function SamplesEditorPage() {
  return (
    <Row>
      <Col>
        <section>
          <h1>1. Components</h1>
          <ComponentsEditor />
        </section>
      </Col>
      <Col>
        <section>
          <h1>2. Samples</h1>
          <SamplesEditor />
        </section>
      </Col>
    </Row>
  );
}
