// import { useController, useSuspense } from 'rest-hooks';
import { useParams } from 'react-router-dom';
// import { set } from 'lodash';

import NetworkErrorPage from 'components/NetworkErrorPage';
// import { useSchema } from 'hooks/useSpec';
// import { useProposalInfo } from 'hooks/useProposalInfo';
// import { useProposal } from 'hooks/useProposal';
// import { SampleResource } from 'api/resources/Sample';
// import { ProteinResource } from 'api/resources/Protein';

import EventList from 'components/Events/EventsList';
// import InlineEditable from 'components/RJSF/InlineEditable';
// import { Button } from 'react-bootstrap';
// import { Search } from 'react-bootstrap-icons';

// function ViewProtein({ proteinId }: { proteinId: number }) {
//   const { proposalName } = useProposal();
//   const navigate = useNavigate();
//   return (
//     <Button
//       onClick={() =>
//         navigate(`/proposals/${proposalName}/proteins/${proteinId}`)
//       }
//     >
//       <Search />
//     </Button>
//   );
// }

function ViewSampleMain() {
  const { blSampleId } = useParams();
  // const proposal = useProposalInfo();
  // const controller = useController();

  // const sample = useSuspense(SampleResource.detail(), {
  //   blSampleId,
  // });

  // const schema = useSchema('Sample', 'View Sample');
  // const uiSchema = {
  //   proposalId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
  //   blSampleId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
  //   containerId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
  //   location: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
  //   Crystal: {
  //     crystalId: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
  //     proteinId: {
  //       'ui:options': {
  //         resource: ProteinResource,
  //         params: {
  //           proposalId: proposal.proposalId,
  //         },
  //         key: 'acronym',
  //         value: 'proteinId',
  //       },
  //       'ui:widget': 'remoteSelect',
  //     },
  //     Protein: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
  //   },
  //   _metadata: { 'ui:classNames': 'hidden-row', 'ui:widget': 'hidden' },
  // };

  // function onChange({ field, value }: { field: string; value: any }) {
  //   const obj = {};
  //   set(obj, field, value);
  //   return controller.fetch(
  //     SampleResource.partialUpdate(),
  //     { blSampleId },
  //     obj
  //   );
  // }

  // const editable = [
  //   'root_name',
  //   'root_comments',
  //   'root_Crystal_cell_a',
  //   'root_Crystal_cell_b',
  //   'root_Crystal_cell_c',
  //   'root_Crystal_cell_alpha',
  //   'root_Crystal_cell_beta',
  //   'root_Crystal_cell_gamma',
  //   'root_Crystal_proteinId',
  // ];

  // const staticValues = {
  //   root_Crystal_proteinId: sample.Crystal.Protein.acronym,
  // };

  // const extraComponents = {
  //   root_Crystal_proteinId: (
  //     <ViewProtein proteinId={sample.Crystal.proteinId} />
  //   ),
  // };

  return (
    <div>
      {/* <section>
        <InlineEditable
          editable={editable}
          schema={schema}
          uiSchema={uiSchema}
          formData={sample}
          onChange={onChange}
          staticValues={staticValues}
          extraComponents={extraComponents}
        />
      </section> */}
      <section>
        <EventList blSampleId={blSampleId} limit={5} />
      </section>
    </div>
  );
}

export default function ViewSample() {
  return (
    <NetworkErrorPage>
      <ViewSampleMain />
    </NetworkErrorPage>
  );
}
