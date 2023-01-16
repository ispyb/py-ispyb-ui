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
import Loading from 'components/Loading';
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
import { useController, useSuspense } from 'rest-hooks';

export function RemoveSampleButton({ sample }: { sample: Sample }) {
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

export function CreateSampleModal({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(false);
  const onClick = () => {
    setShow(true);
  };
  const proposal = usePath('proposal');
  const samples = useSuspense(SampleResource.list(), {
    proposal: proposal,
    limit: 1000,
    skip: 0,
  });

  const crystals = _(samples.results)
    .map((s) => s.Crystal)
    .value();

  return (
    <>
      <Button
        size="sm"
        className="text-nowrap"
        style={{ marginLeft: 5 }}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faPlus} /> Create new
      </Button>

      <Modal
        centered
        backdrop="static"
        size="xl"
        show={show}
        onHide={() => setShow(false)}
      >
        <Modal.Header>
          <h5>Create sample</h5>
        </Modal.Header>
        <Modal.Body>
          <LazyLoad>
            <Suspense fallback={<Loading></Loading>}>
              <EditSampleContent
                onDone={() => {
                  setShow(false);
                  onDone();
                }}
                sample={{ Crystal: crystals[0] } as Sample}
              />
            </Suspense>
          </LazyLoad>
        </Modal.Body>
      </Modal>
    </>
  );
}

export function EditSampleModal({ sample }: { sample: Sample }) {
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
type OnChangeFormReplaceType = (value: any) => void;

type SubFormProps = {
  event: OnChangeFormEventType;
  subForm: OnChangeSubFormType;
  value: OnChangeFormValueType;
  remove: OnChangeFormRemoveType;
  replace: OnChangeFormReplaceType;
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
): [T, OnChangeFormValueType, OnChangeFormEventType, OnChangeSubFormType] {
  const [vState, setVState] = useState({ ...v });

  const onChange = (property: _.PropertyPath) => {
    return (newValue: any) => {
      const next = produce(vState, (draft) => {
        const v = newValue === '' || newValue === null ? undefined : newValue;
        set(draft, property, v);
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

    const replace = (value: any) => {
      onChangeFormValue(property)(value);
    };

    const subForm: OnChangeSubFormType = (subProperty: _.PropertyPath) => {
      return onChangeSubForm(concatPropertyPath(property, subProperty));
    };
    return { event, value, subForm, remove, replace };
  };

  return [vState, onChange, onChangeFormEvent, onChangeSubForm];
}

function validateSample(sample: Sample) {
  return {
    name: sample.name ? undefined : 'Name is mandatory.',
    sample_compositions: sample.sample_compositions?.map((v) => {
      if (v === undefined) return undefined;
      const quantityError =
        v.abundance || v.ph || v.ratio
          ? undefined
          : 'One of concentration, ph and ratio is mandatory.';

      const componentError =
        v.Component === undefined ||
        Object.keys(v.Component).length === 0 ||
        v.Component.name === undefined ||
        v.Component.ComponentType === undefined
          ? 'Please select component and type.'
          : undefined;
      return {
        quantity: quantityError,
        Component: componentError,
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
            : 'One of concentration, ph and ratio is mandatory.';
        const componentError =
          v.Component === undefined ||
          Object.keys(v.Component).length === 0 ||
          v.Component.name === undefined ||
          v.Component.ComponentType === undefined
            ? 'Please select component and type.'
            : undefined;
        return {
          quantity: quantityError,
          Component: componentError,
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
  const [sampleState, onChangeValue, onChangeForm, onChangeSubForm] =
    useFormChangeHandler(sample);

  const errors: ErrorListType = validateSample(sampleState);

  const controller = useController();

  const onSubmit = () => {
    if (sampleState.blSampleId) {
      return controller
        .fetch(
          SampleResource.partialUpdate(),
          { blSampleId: sampleState.blSampleId },
          sampleState
        )
        .then(() => onDone());
    } else {
      return controller
        .fetch(SampleResource.create(), sampleState)
        .then(() => onDone());
    }
  };

  return (
    <Container>
      <Form>
        <Col>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={sampleState.name || ''}
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
          <Form.Label>Support</Form.Label>
          <ReactSelect
            value={{ label: sampleState.loopType, value: sampleState.loopType }}
            options={['Injector', 'Chip', 'Foils', 'Tape drive', 'Other'].map(
              (v) => {
                return {
                  label: v,
                  value: v,
                };
              }
            )}
            onChange={(v) => {
              v && onChangeValue('loopType')(v.value);
            }}
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
            <Button disabled={hasErrors(errors)} onClick={onSubmit}>
              Submit
            </Button>
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

  const crystals = _(samples.results)
    .map((s) => s.Crystal)
    .uniqBy(getCrystalValue)
    .value();

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

  const onSelectProtein = (newValue: string) => {
    const newProtein = _(proteins.results)
      .filter((p) => p.acronym === newValue)
      .get(0);
    if (newProtein) {
      onChange.value('Protein')({ ...newProtein });
    }
  };

  const onSelectCrystal = (newValue: string) => {
    const newCrystal = _(crystals)
      .filter((c) => getCrystalValue(c) === newValue)
      .get(0);
    if (newCrystal) {
      onChange.replace({ ...newCrystal });
    }
  };

  const onNewCrystal = () => {
    setNewCrystal(true);
    onChange.replace({
      Protein: proteins.results[0],
    });
  };

  const onCloseNewCrystal = () => {
    setNewCrystal(false);
    onChange.replace(crystals[0]);
  };

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
                  onClick={onCloseNewCrystal}
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
                onChange={(newValue) =>
                  newValue && onSelectProtein(newValue?.value)
                }
              />
            </Row>
            <Row>
              <Col>
                <Form.Label>a</Form.Label>
                <Form.Control
                  type="number"
                  value={sample.Crystal.cell_a || ''}
                  onChange={onChange.event('cell_a')}
                />
              </Col>
              <Col>
                <Form.Label>b</Form.Label>
                <Form.Control
                  type="number"
                  value={sample.Crystal.cell_b || ''}
                  onChange={onChange.event('cell_b')}
                />
              </Col>
              <Col>
                <Form.Label>c</Form.Label>
                <Form.Control
                  type="number"
                  value={sample.Crystal.cell_c || ''}
                  onChange={onChange.event('cell_c')}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>alpha</Form.Label>
                <Form.Control
                  type="number"
                  value={sample.Crystal.cell_alpha || ''}
                  onChange={onChange.event('cell_alpha')}
                />
              </Col>
              <Col>
                <Form.Label>beta</Form.Label>
                <Form.Control
                  type="number"
                  value={sample.Crystal.cell_beta || ''}
                  onChange={onChange.event('cell_beta')}
                />
              </Col>
              <Col>
                <Form.Label>gamma</Form.Label>
                <Form.Control
                  type="number"
                  value={sample.Crystal.cell_gamma || ''}
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
              onCreateOption={onNewCrystal}
              onChange={(newValue) =>
                newValue && onSelectCrystal(newValue?.value)
              }
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
      Component: {
        ...(components.results.length ? components.results[0] : {}),
      },
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

  const selectedType = composition.Component?.ComponentType?.name;

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
          <Form.Label>Concentration</Form.Label>
          <Form.Control
            value={composition.abundance || ''}
            type="number"
            onChange={onChange.event('abundance')}
            isInvalid={getErrorMessage(errors, 'quantity') !== undefined}
          />
        </Col>
        <Col>
          <Form.Label>Ratio</Form.Label>
          <Form.Control
            value={composition.ratio || ''}
            type="number"
            onChange={onChange.event('ratio')}
            isInvalid={getErrorMessage(errors, 'quantity') !== undefined}
          />
        </Col>
        <Col>
          <Form.Label>pH</Form.Label>
          <Form.Control
            value={composition.ph || ''}
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
              label: composition.Component?.name,
              value: composition.Component?.name,
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
        <Col xs={'auto'}>
          <div className="is-invalid"></div>
          <Form.Control.Feedback type="invalid">
            {getErrorMessage(errors, 'quantity')}
          </Form.Control.Feedback>
        </Col>
        <Col></Col>
        <Col xs={'auto'}>
          <div className="is-invalid"></div>
          <Form.Control.Feedback type="invalid" style={{ paddingRight: 60 }}>
            {getErrorMessage(errors, 'Component')}
          </Form.Control.Feedback>
        </Col>
      </Row>
    </Form>
  );
}
