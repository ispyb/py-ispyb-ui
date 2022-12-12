// import { useSuspense, useController } from 'rest-hooks';
import { useParams } from 'react-router-dom';
// import { set } from 'lodash';

import NetworkErrorPage from 'components/NetworkErrorPage';
// import { useSchema } from 'hooks/useSpec';
// import { ProteinResource } from 'api/resources/Protein';

import EventList from 'components/Events/EventsList';
// import InlineEditable from 'components/RJSF/InlineEditable';
import SamplesList from 'components/Samples/SamplesList';

function ViewProteinMain() {
  const { proteinId } = useParams();
  // const controller = useController();
  // const protein = useSuspense(ProteinResource.detail(), {
  //   proteinId,
  // });

  // const schema = useSchema('Protein', 'View Protein');
  // const uiSchema = {
  //   proposalId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
  //   proteinId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
  //   sequence: { 'ui:widget': 'textarea' },
  //   _metadata: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
  //   ComponentType: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
  // };

  // function onChange({ field, value }: { field: string; value: any }) {
  //   const obj = {};
  //   set(obj, field, value);
  //   return controller.fetch(
  //     ProteinResource.partialUpdate(),
  //     { proteinId },
  //     obj
  //   );
  // }

  // const editable = [
  //   'root_name',
  //   'root_acronym',
  //   'root_sequence',
  //   'root_density',
  //   'root_molecularMass',
  // ];

  return (
    <div>
      {/* <section>
        <InlineEditable
          editable={editable}
          schema={schema}
          uiSchema={uiSchema}
          formData={protein}
          onChange={onChange}
        />
      </section> */}
      <section>
        <SamplesList proteinId={proteinId} />
      </section>
      <section>
        <EventList proteinId={proteinId} limit={5} />
      </section>
    </div>
  );
}

export default function ViewProtein() {
  return (
    <NetworkErrorPage>
      <ViewProteinMain />
    </NetworkErrorPage>
  );
}
