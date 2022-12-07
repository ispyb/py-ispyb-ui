import { useRef } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { Truck } from 'react-bootstrap-icons';

import Form from 'components/RJSF/Form';
import { useSchema } from 'hooks/useSpec';
import { useInformativeSubmit } from 'hooks/useInformativeSubmit';
import { ShippingResource } from 'api/resources/Shipping';
import ParsedError from 'components/ParsedError';
import { useProposalInfo } from '../../hooks/useProposalInfo';
import { LabContactResource } from 'api/resources/LabContact';

export default function CreateShipping() {
  const proposal = useProposalInfo();
  const alertRef = useRef<any>();
  const { onSubmit, pending, error, lastFormData } = useInformativeSubmit({
    resource: ShippingResource,
    redirect: `/proposals/${proposal.proposal}/shipments`,
    redirectKey: 'shippingId',
    alertRef,
    initialFormData: {
      proposalId: proposal.proposalId,
    },
  });

  const schema = useSchema('ShippingCreate', 'Create Shipment');
  const uiSchema = {
    proposalId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
    sendingLabContactId: {
      'ui:options': {
        resource: LabContactResource,
        params: {
          proposalId: proposal.proposalId,
        },
        key: 'cardName',
        value: 'labContactId',
      },
      'ui:widget': 'remoteSelect',
    },
    returnLabContactId: {
      'ui:options': {
        resource: LabContactResource,
        params: {
          proposalId: proposal.proposalId,
        },
        key: 'cardName',
        value: 'labContactId',
      },
      'ui:widget': 'remoteSelect',
    },
    comments: {
      'ui:widget': 'textarea',
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
              {!pending && <Truck className="me-1" />}
              Create Shipment
            </>
          </Button>
        </div>
      </Form>
    </section>
  );
}
