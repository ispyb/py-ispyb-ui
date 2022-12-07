import { useController, useSuspense } from 'rest-hooks';
import { useParams } from 'react-router-dom';
import { set } from 'lodash';

import NetworkErrorPage from 'components/NetworkErrorPage';
import { useSchema } from 'hooks/useSpec';
import { useProposalInfo } from 'hooks/useProposalInfo';
import { ShippingResource } from 'api/resources/Shipping';
import { LabContactResource } from 'api/resources/LabContact';
import InlineEditable from 'components/RJSF/InlineEditable';

function ViewShippingMain() {
  const { shippingId } = useParams();
  const proposal = useProposalInfo();
  const controller = useController();

  const contact = useSuspense(ShippingResource.detail(), {
    shippingId,
  });

  const schema = useSchema('Shipping', 'View Shipment');
  const uiSchema = {
    proposalId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
    shippingId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
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

    LabContact: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
    LabContact1: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
    _metadata: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
  };

  function onChange({ field, value }: { field: string; value: any }) {
    const obj = {};
    set(obj, field, value);
    return controller.fetch(
      ShippingResource.partialUpdate(),
      { shippingId },
      obj
    );
  }

  const editable = [
    'root_shippingName',
    'root_returnLabContactId',
    'root_sendingLabContactId',
    'root_safetyLevel',
    'root_comments',
  ];
  const staticValues = {
    root_returnLabContactId: contact.LabContact?.cardName,
    root_sendingLabContactId: contact.LabContact1?.cardName,
  };

  return (
    <section>
      <InlineEditable
        schema={schema}
        uiSchema={uiSchema}
        formData={contact}
        onChange={onChange}
        editable={editable}
        staticValues={staticValues}
      />
    </section>
  );
}

export default function ViewShipping() {
  return (
    <NetworkErrorPage>
      <ViewShippingMain />
    </NetworkErrorPage>
  );
}
