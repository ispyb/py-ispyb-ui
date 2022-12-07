import { useController, useSuspense } from 'rest-hooks';
import { useParams } from 'react-router-dom';
import { set } from 'lodash';

import NetworkErrorPage from 'components/NetworkErrorPage';
import { useSchema } from 'hooks/useSpec';
import { LabContactResource } from 'api/resources/LabContact';
import InlineEditable from 'components/RJSF/InlineEditable';

function ViewLabContactMain() {
  const { labContactId } = useParams();
  const controller = useController();

  const contact = useSuspense(LabContactResource.detail(), {
    labContactId,
  });

  const schema = useSchema('LabContact', 'View Lab Contact');
  const uiSchema = {
    proposalId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
    labContactId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
    personId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
    recordTimeStamp: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
    Person: {
      Laboratory: {
        laboratoryId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
        recordTimeStamp: {
          'ui:classNames': 'hidden-row',
          'ui:widget': 'hidden',
        },
        laboratoryExtPk: {
          'ui:classNames': 'hidden-row',
          'ui:widget': 'hidden',
        },
      },
    },
  };

  function onChange({ field, value }: { field: string; value: any }) {
    const obj = {};
    set(obj, field, value);
    return controller.fetch(
      LabContactResource.partialUpdate(),
      { labContactId },
      obj
    );
  }

  const editable = [
    'root_cardName',
    'root_courierAccount',
    'root_billingReference',
    'root_defaultCourrierCompany',
    'root_dewarAvgCustomsValue',
    'root_dewarAvgTransportValue',
    'root_Person_emailAddress',
    'root_Person_phoneNumber',
    'root_Person_Laboratory_name',
    'root_Person_Laboratory_address',
    'root_Person_Laboratory_city',
    'root_Person_Laboratory_country',
    'root_Person_Laboratory_url',
  ];

  return (
    <section>
      <InlineEditable
        schema={schema}
        uiSchema={uiSchema}
        formData={contact}
        onChange={onChange}
        editable={editable}
      />
    </section>
  );
}

export default function ViewLabContact() {
  return (
    <NetworkErrorPage>
      <ViewLabContactMain />
    </NetworkErrorPage>
  );
}
