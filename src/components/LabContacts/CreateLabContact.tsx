import { useRef } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { PersonPlus } from 'react-bootstrap-icons';

import Form from 'components/RJSF/Form';
import { useSchema } from 'hooks/useSpec';
import { useInformativeSubmit } from 'hooks/useInformativeSubmit';
import { LabContactResource } from 'api/resources/LabContact';
import ParsedError from 'components/ParsedError';
import { useProposalInfo } from '../../hooks/useProposalInfo';

export default function CreateLabContact() {
  const proposal = useProposalInfo();
  const alertRef = useRef<any>();
  const { onSubmit, pending, error, lastFormData } = useInformativeSubmit({
    resource: LabContactResource,
    redirect: proposal && `/proposals/${proposal.proposal}/contacts`,
    redirectKey: 'labContactId',
    alertRef,
    initialFormData: {
      proposalId: proposal && proposal.proposalId,
    },
  });

  const schema = useSchema('LabContactCreate', 'Create Lab Contact');
  const uiSchema = {
    proposalId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
    Person: {
      Laboratory: {
        laboratoryExtPk: {
          'ui:classNames': 'hidden-row',
          'ui:widget': 'hidden',
        },
        recordTimeStamp: {
          'ui:classNames': 'hidden-row',
          'ui:widget': 'hidden',
        },
      },
    },
  };

  return (
    <section>
      <ParsedError error={error} ref={alertRef} />
      <Form
        liveValidate
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        formData={lastFormData}
        disabled={pending}
      >
        <div className="d-grid">
          <Button type="submit" disabled={pending}>
            <>
              {pending && (
                <Spinner
                  size="sm"
                  animation="border"
                  role="status"
                  variant="light"
                  className="me-1"
                >
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
              {!pending && <PersonPlus className="me-1" />}
              Create Contact
            </>
          </Button>
        </div>
      </Form>
    </section>
  );
}
