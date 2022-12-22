import {
  faClose,
  faEdit,
  faPlus,
  faRemove,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProteinResource } from 'api/resources/Protein';
import { ComponentResource, SampleResource } from 'api/resources/Sample';
import Table from 'components/Layout/Table';
import Loading from 'components/Loading';
import { usePaging } from 'hooks/usePaging';
import { usePath } from 'hooks/usePath';
import produce from 'immer';
import _ from 'lodash';
import { set } from 'lodash';
import { Sample, Composition, Crystal } from 'models/Sample';
import { Suspense, useState } from 'react';
import { Button, Col, Container, Modal, Row, Form } from 'react-bootstrap';
import LazyLoad from 'react-lazy-load';
import ReactSelect, { GroupBase } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useSuspense } from 'rest-hooks';

export default function SamplesEditor() {
  const proposal = usePath('proposal');
  const { skip, limit } = usePaging(10, 0, 'samples');

  const samples = useSuspense(SampleResource.list(), {
    skip,
    limit,
    ...(proposal ? { proposal } : {}),
  });

  return (
    <>
      <Row>
        <Col>
          <Button size="sm">
            <FontAwesomeIcon icon={faPlus} /> Create new
          </Button>
        </Col>
      </Row>
      <Table
        key={'samples'}
        columns={[
          { label: 'Name', key: 'name' },
          {
            label: '',
            key: 'edit',
            formatter: (row) => <EditSampleModal sample={row} />,
            headerStyle: { width: 0 },
          },
          {
            label: '',
            key: 'remove',
            formatter: (row) => <RemoveSampleButton sample={row} />,
            headerStyle: { width: 0 },
          },
        ]}
        results={samples.results}
        keyId={'blSampleId'}
        paginator={{
          total: samples.total,
          skip: samples.skip,
          limit: samples.limit,
          suffix: 'samples',
        }}
      />
    </>
  );
}

function RemoveSampleButton({ sample }: { sample: Sample }) {
  const onClick = () => {};
  return (
    <Button
      size="sm"
      className="text-nowrap"
      variant="danger"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faTrash} /> Remove
    </Button>
  );
}

function EditSampleModal({ sample }: { sample: Sample }) {
  const [show, setShow] = useState(false);
  const onClick = () => {
    setShow(true);
  };
  return (
    <>
      <Button size="sm" className="text-nowrap" onClick={onClick}>
        <FontAwesomeIcon icon={faEdit} /> Edit
      </Button>

      <Modal
        centered
        backdrop="static"
        size="xl"
        show={show}
        onHide={() => setShow(false)}
      >
        <Modal.Header>
          <h5>Edit sample</h5>
        </Modal.Header>
        <Modal.Body>
          <LazyLoad>
            <Suspense fallback={<Loading></Loading>}>
              <EditSampleContent
                onDone={() => setShow(false)}
                sample={sample}
              />
            </Suspense>
          </LazyLoad>
        </Modal.Body>
      </Modal>
    </>
  );
}

type OnChangeFormEventType = (
  property: _.PropertyPath
) => React.ChangeEventHandler;

type OnChangeFormValueType = (property: _.PropertyPath) => (value: any) => void;

type OnChangeSubFormType = (property: _.PropertyPath) => SubFormProps;

type OnChangeFormRemoveType = () => void;

type SubFormProps = {
  event: OnChangeFormEventType;
  subForm: OnChangeSubFormType;
  value: OnChangeFormValueType;
  remove: OnChangeFormRemoveType;
};

type ErrorListType =
  | { [k: string]: ErrorListType }
  | undefined
  | ErrorListType[]
  | string[]
  | string;

const getSubFormErrors = (
  e: ErrorListType,
  path: string | number
): ErrorListType => {
  if (e === undefined) return undefined;
  if (typeof e === 'string') return undefined;
  return _.get(e, path, undefined);
};
const getErrorMessage = (
  e: ErrorListType,
  path?: string | number
): string | undefined => {
  if (e === undefined) return undefined;
  if (!path && typeof e === 'string') return e;
  if (path) return _.get(e, path, undefined);
  return undefined;
};

const hasErrors = (e: ErrorListType): boolean => {
  if (e === undefined) return false;
  if (typeof e === 'string') return true;
  if (!Array.isArray(e)) {
    for (const path in e) {
      const v = e[path];
      if (typeof v == 'string') return true;
      if (hasErrors(v)) return true;
    }
  } else {
    for (const v of e) {
      if (hasErrors(v)) return true;
    }
  }
  return false;
};

function useFormChangeHandler<T extends Object>(
  v: T
): [T, OnChangeFormEventType, OnChangeSubFormType] {
  const [vState, setVState] = useState({ ...v });

  const onChange = (property: _.PropertyPath) => {
    return (newValue: any) => {
      const next = produce(vState, (draft) => {
        set(draft, property, newValue);
      });
      setVState(next);
      console.log(next);
    };
  };

  const onChangeFormEvent: OnChangeFormEventType = (
    property: _.PropertyPath
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(property)(e.target.value);
    };
  };

  const onChangeFormValue: OnChangeFormValueType = (
    property: _.PropertyPath
  ) => {
    return (value: any) => {
      onChange(property)(value);
    };
  };

  const onChangeSubForm: OnChangeSubFormType = (property: _.PropertyPath) => {
    function concatPropertyPath(
      a: _.PropertyPath,
      b: _.PropertyPath
    ): _.PropertyPath {
      if (Array.isArray(a)) {
        if (Array.isArray(b)) {
          return [...a, ...b];
        } else {
          return [...a, b];
        }
      } else {
        if (Array.isArray(b)) {
          return [a, ...b];
        } else {
          return [a as any, b];
        }
      }
    }
    const event: OnChangeFormEventType = (subProperty: _.PropertyPath) => {
      return onChangeFormEvent(concatPropertyPath(property, subProperty));
    };

    const value: OnChangeFormValueType = (subProperty: _.PropertyPath) => {
      return onChangeFormValue(concatPropertyPath(property, subProperty));
    };

    const remove = () => {
      onChangeFormValue(property)(undefined);
    };

    const subForm: OnChangeSubFormType = (subProperty: _.PropertyPath) => {
      return onChangeSubForm(concatPropertyPath(property, subProperty));
    };
    return { event, value, subForm, remove };
  };

  return [vState, onChangeFormEvent, onChangeSubForm];
}

function validateSample(sample: Sample) {
  return {
    name: sample.name ? undefined : 'Name is mandatory.',
    sample_compositions: sample.sample_compositions?.map((v) => {
      if (v === undefined) return undefined;
      const quantityError =
        v.abundance || v.ph || v.ratio
          ? undefined
          : 'One of abundance, ph and ratio is mandatory.';
      return {
        quantity: quantityError,
      };
    }),
    Crystal: {
      Protein: sample.Crystal.Protein?.acronym
        ? undefined
        : 'Protein is mandatory',
      crystal_compositions: sample.Crystal.crystal_compositions?.map((v) => {
        if (v === undefined) return undefined;
        const quantityError =
          v.abundance || v.ph || v.ratio
            ? undefined
            : 'One of abundance, ph and ratio is mandatory.';
        return {
          quantity: quantityError,
        };
      }),
    },
  };
}

function EditSampleContent({
  sample,
  onDone,
}: {
  sample: Sample;
  onDone: () => void;
}) {
  const [sampleState, onChangeForm, onChangeSubForm] =
    useFormChangeHandler(sample);

  const errors: ErrorListType = validateSample(sampleState);

  return (
    <Container>
      <Form>
        <Col>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={sampleState.name}
            onChange={onChangeForm('name')}
            type="text"
            isInvalid={getErrorMessage(errors, 'name') !== undefined}
          />
          <Form.Control.Feedback type="invalid">
            {getErrorMessage(errors, 'name')}
          </Form.Control.Feedback>
          <Form.Label>Comments</Form.Label>
          <Form.Control
            value={sampleState.comments || ''}
            onChange={onChangeForm('comments')}
            type="text"
          />
        </Col>
        <br />
        <CompositionsEdit
          compositions={sampleState.sample_compositions || []}
          onChange={onChangeSubForm('sample_compositions')}
          errors={getSubFormErrors(errors, 'sample_compositions')}
        />
        <br />
        <CrystalEdit
          onChange={onChangeSubForm('Crystal')}
          sample={sampleState}
          errors={getSubFormErrors(errors, 'Crystal')}
        />
        <br />
        <Row>
          <Col></Col>
          <Col xs="auto">
            <Button disabled={hasErrors(errors)}>Submit</Button>
          </Col>
          <Col xs="auto">
            <Button variant={'danger'} onClick={onDone}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

function CrystalEdit({
  sample,
  onChange,
  errors,
}: {
  sample: Sample;
  onChange: SubFormProps;
  errors: ErrorListType;
}) {
  const [newCrystal, setNewCrystal] = useState(false);
  const getCrystalValue = (crystal: Crystal) => {
    return `${crystal.Protein.acronym} [${crystal.cell_a}, ${crystal.cell_b}, ${crystal.cell_c}, ${crystal.cell_alpha}, ${crystal.cell_beta}, ${crystal.cell_gamma}]`;
  };
  const proposal = usePath('proposal');

  const proteins = useSuspense(ProteinResource.list(), {
    proposal: proposal,
    limit: 1000,
    skip: 0,
  });

  const samples = useSuspense(SampleResource.list(), {
    proposal: proposal,
    limit: 1000,
    skip: 0,
  });

  const crystals = samples.results.map((s) => s.Crystal);

  interface CrystalOption {
    readonly label: string;
    readonly value: string;
  }
  const crystalOptions: CrystalOption[] = crystals.map((c) => {
    return {
      label: getCrystalValue(c),
      value: getCrystalValue(c),
    };
  });

  const crystalOptionsGroup: GroupBase<CrystalOption> = {
    label: 'Type to search...',
    options: crystalOptions,
  };

  const onNewCrystal = {};

  return (
    <Col>
      <section>
        {newCrystal ? (
          <div
            style={{
              border: '1px solid lightgrey',
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Row>
              <Col xs={'auto'}>
                <h4>New crystal</h4>
              </Col>
              <Col></Col>
              <Col xs={'auto'}>
                <Button
                  size="lg"
                  className="p-0"
                  variant="link"
                  onClick={() => setNewCrystal(false)}
                >
                  <FontAwesomeIcon size="xl" icon={faClose} />
                </Button>
              </Col>
            </Row>
            <Row>
              <Form.Label>Protein</Form.Label>
              <ReactSelect
                value={{
                  label: sample.Crystal.Protein.acronym,
                  value: sample.Crystal.Protein.acronym,
                }}
                options={proteins.results.map((p) => {
                  return {
                    label: p.acronym,
                    value: p.acronym,
                  };
                })}
              />
            </Row>
            <Row>
              <Col>
                <Form.Label>a</Form.Label>
                <Form.Control
                  type="number"
                  value={sample.Crystal.cell_a || undefined}
                  onChange={onChange.event('cell_a')}
                />
              </Col>
              <Col>
                <Form.Label>b</Form.Label>
                <Form.Control
                  type="number"
                  value={sample.Crystal.cell_b || undefined}
                  onChange={onChange.event('cell_b')}
                />
              </Col>
              <Col>
                <Form.Label>c</Form.Label>
                <Form.Control
                  type="number"
                  value={sample.Crystal.cell_c || undefined}
                  onChange={onChange.event('cell_c')}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>alpha</Form.Label>
                <Form.Control
                  type="number"
                  value={sample.Crystal.cell_alpha || undefined}
                  onChange={onChange.event('cell_alpha')}
                />
              </Col>
              <Col>
                <Form.Label>beta</Form.Label>
                <Form.Control
                  type="number"
                  value={sample.Crystal.cell_beta || undefined}
                  onChange={onChange.event('cell_beta')}
                />
              </Col>
              <Col>
                <Form.Label>gamma</Form.Label>
                <Form.Control
                  type="number"
                  value={sample.Crystal.cell_gamma || undefined}
                  onChange={onChange.event('cell_gamma')}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <CompositionsEdit
                onChange={onChange.subForm('crystal_compositions')}
                compositions={sample.Crystal.crystal_compositions || []}
                errors={getSubFormErrors(errors, 'crystal_compositions')}
              />
            </Row>
          </div>
        ) : (
          <div>
            <h4>Crystal</h4>
            <CreatableSelect
              value={{
                label: getCrystalValue(sample.Crystal),
                value: getCrystalValue(sample.Crystal),
              }}
              options={[crystalOptionsGroup]}
              formatCreateLabel={() => {
                return 'Create new crystal...';
              }}
              createOptionPosition={'first'}
              isValidNewOption={() => true}
              onCreateOption={() => setNewCrystal(true)}
            />
          </div>
        )}
      </section>
    </Col>
  );
}

function CompositionsEdit({
  compositions,
  onChange,
  errors,
}: {
  compositions: Composition[];
  onChange: SubFormProps;
  errors: ErrorListType;
}) {
  const proposal = usePath('proposal');
  const components = useSuspense(ComponentResource.list(), {
    skip: 0,
    limit: 1000,
    proposal,
  });

  const onNewComponent = () => {
    onChange.value(compositions.length)({
      Component: { ...components.results[0] },
    });
  };

  return (
    <Col>
      <section>
        <h4>Composition</h4>
        {compositions?.map((composition, index) => (
          <CompositionEdit
            key={index}
            composition={composition}
            onChange={onChange.subForm(index)}
            errors={getSubFormErrors(errors, index)}
          />
        ))}
        <br />
        <Row>
          <Col>
            <Button onClick={onNewComponent} size={'sm'}>
              Add new component
            </Button>
          </Col>
        </Row>
      </section>
    </Col>
  );
}

function CompositionEdit({
  composition,
  onChange,
  errors,
}: {
  composition?: Composition;
  onChange: SubFormProps;
  errors: ErrorListType;
}) {
  const proposal = usePath('proposal');
  const components = useSuspense(ComponentResource.list(), {
    skip: 0,
    limit: 1000,
    proposal: proposal,
  });

  if (composition === undefined) return null;

  const types = _(components.results)
    .map((c) => c.ComponentType.name)
    .uniq()
    .value();

  const selectedType = composition.Component.ComponentType.name;

  const onSelectType = (newValue: string) => {
    const newComponent = _(components.results)
      .filter((c) => c.ComponentType.name === newValue)
      .get(0);
    if (newComponent) {
      onChange.value('Component')({ ...newComponent });
    } else {
      onChange.value('Component')({
        ComponentType: { name: newValue },
        name: composition.Component.name,
      });
    }
  };

  const availableComponents = components.results.filter(
    (c) => c.ComponentType.name === selectedType
  );

  const onSelectComponent = (newValue: string) => {
    const newComponent = _(availableComponents)
      .filter((c) => c.name === newValue)
      .get(0);
    if (newComponent) {
      onChange.value('Component')({ ...newComponent });
    } else {
      onChange.value('Component')({
        ComponentType: composition.Component.ComponentType,
        name: newValue,
      });
    }
  };

  const onRemove = () => {
    onChange.remove();
  };

  interface ComponentOption {
    readonly label: string;
    readonly value: string;
  }
  const componentOptions: ComponentOption[] = availableComponents.map((c) => {
    return {
      label: c.name,
      value: c.name,
    };
  });

  const componentOptionsGroup: GroupBase<ComponentOption> = {
    label: 'Type to search or create...',
    options: componentOptions,
  };

  return (
    <Form>
      <Row className="align-items-end">
        <Col>
          <Form.Label>Abundance</Form.Label>
          <Form.Control
            value={composition.abundance || undefined}
            type="number"
            onChange={onChange.event('abundance')}
            isInvalid={getErrorMessage(errors, 'quantity') !== undefined}
          />
        </Col>
        <Col>
          <Form.Label>Ratio</Form.Label>
          <Form.Control
            value={composition.ratio || undefined}
            type="number"
            onChange={onChange.event('ratio')}
            isInvalid={getErrorMessage(errors, 'quantity') !== undefined}
          />
        </Col>
        <Col>
          <Form.Label>pH</Form.Label>
          <Form.Control
            value={composition.ph || undefined}
            type="number"
            onChange={onChange.event('ph')}
            isInvalid={getErrorMessage(errors, 'quantity') !== undefined}
          />
        </Col>
        <Col>
          <Form.Label>Type</Form.Label>
          <CreatableSelect
            value={{
              label: selectedType,
              value: selectedType,
            }}
            options={types.map((t) => {
              return {
                label: t,
                value: t,
              };
            })}
            onChange={(newValue) => newValue && onSelectType(newValue?.value)}
            onCreateOption={(input) => input && onSelectType(input)}
          />
        </Col>
        <Col>
          <Form.Label>Component</Form.Label>
          <CreatableSelect<ComponentOption>
            value={{
              label: composition.Component.name,
              value: composition.Component.name,
            }}
            options={[componentOptionsGroup]}
            onChange={(newValue) =>
              newValue && onSelectComponent(newValue?.value)
            }
            onCreateOption={(input) => input && onSelectComponent(input)}
          />
        </Col>
        <Col xs={'auto'}>
          <Button variant={'danger'} size="sm" onClick={onRemove}>
            <FontAwesomeIcon icon={faRemove} />
          </Button>
        </Col>
      </Row>
      <Row>
        <div className="is-invalid"></div>
        <Form.Control.Feedback type="invalid">
          {getErrorMessage(errors, 'quantity')}
        </Form.Control.Feedback>
      </Row>
    </Form>
  );
}
