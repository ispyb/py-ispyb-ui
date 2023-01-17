import {
  faClose,
  faEdit,
  faPlus,
  faRemove,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProteinResource } from 'api/resources/Protein';
import {
  ComponentResource,
  ConcentrationTypesRessource,
  SampleResource,
} from 'api/resources/Sample';
import Loading from 'components/Loading';
import { usePath } from 'hooks/usePath';
import _ from 'lodash';
import { Sample, Composition, Crystal } from 'models/Sample';
import { Suspense, useState } from 'react';
import {
  Button,
  Col,
  Container,
  Modal,
  Row,
  Form,
  Alert,
} from 'react-bootstrap';
import LazyLoad from 'react-lazy-load';
import ReactSelect, { GroupBase } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useController, useSuspense } from 'rest-hooks';
import {
  useFormChangeHandler,
  ErrorListType,
  getErrorMessage,
  getSubFormErrors,
  hasErrors,
  SubFormProps,
} from './formlogic';

export function RemoveSampleButton({
  sample,
  onDone,
}: {
  sample: Sample;
  onDone: () => void;
}) {
  const controller = useController();

  const onClick = () => {
    controller
      .fetch(SampleResource.delete(), {
        blSampleId: sample.blSampleId,
      })
      .then(() => onDone());
  };

  if (sample._metadata?.datacollections || sample._metadata?.autoIntegrations)
    return null;
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

export function EditSampleModal({
  sample,
  onDone,
}: {
  sample: Sample;
  onDone: () => void;
}) {
  const [show, setShow] = useState(false);
  const onClick = () => {
    setShow(true);
  };
  const collected =
    sample._metadata?.datacollections || sample._metadata?.autoIntegrations;
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
          {collected ? (
            <Alert variant="warning">
              This sample is already collected. Are you sure you want to edit
              it?
            </Alert>
          ) : null}
          <LazyLoad>
            <Suspense fallback={<Loading></Loading>}>
              <EditSampleContent
                onDone={() => {
                  setShow(false);
                  onDone();
                }}
                sample={sample}
              />
            </Suspense>
          </LazyLoad>
        </Modal.Body>
      </Modal>
    </>
  );
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
    Crystal:
      sample.Crystal === undefined
        ? 'Crystal is mandatory'
        : {
            Protein: sample.Crystal.Protein?.acronym
              ? undefined
              : 'Protein is mandatory',
            crystal_compositions: sample.Crystal.crystal_compositions?.map(
              (v) => {
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
              }
            ),
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
          crystalError={getErrorMessage(errors, 'Crystal')}
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
  crystalError,
}: {
  sample: Sample;
  onChange: SubFormProps;
  errors: ErrorListType;
  crystalError: string | undefined;
}) {
  const [newCrystal, setNewCrystal] = useState(false);
  const getCrystalValue = (crystal: Crystal) => {
    if (crystal === undefined) return 'undefined';
    const cells = [
      crystal.cell_a,
      crystal.cell_b,
      crystal.cell_c,
      crystal.cell_alpha,
      crystal.cell_beta,
      crystal.cell_gamma,
    ];
    if (cells.every((v) => !v)) {
      return `${crystal.Protein.acronym}`;
    }
    return `${crystal.Protein.acronym} [${cells
      .map((c) => (c ? c : 'null'))
      .join(', ')}]`;
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
          <Col>
            <Row>
              <h4>Crystal</h4>
            </Row>
            <Row>
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
                styles={{
                  control: (styles) => ({
                    ...styles,
                    ...(crystalError !== undefined
                      ? { borderColor: '#d32f2f' }
                      : {}),
                  }),
                }}
              />
            </Row>
            <Row>
              <Col xs={'auto'}>
                <div className="is-invalid"></div>
                <Form.Control.Feedback
                  type="invalid"
                  style={{ paddingRight: 60 }}
                >
                  {crystalError}
                </Form.Control.Feedback>
              </Col>
            </Row>
          </Col>
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

  const concentrationTypes = useSuspense(ConcentrationTypesRessource.list());

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

  const onSelectConcentrationType = (newValue: string | undefined) => {
    if (!newValue) {
      onChange.value('ConcentrationType')(undefined);
    } else {
      const newType = _(concentrationTypes)
        .filter((c) => c.symbol === newValue)
        .get(0);
      onChange.value('ConcentrationType')(newType);
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
    <>
      <Row className="align-items-end">
        <Col>
          <Form.Label>Concentration</Form.Label>
          <Row>
            <Col xs={6} style={{ paddingRight: 0, marginRight: -1 }}>
              <Form.Control
                value={composition.abundance || ''}
                type="number"
                onChange={onChange.event('abundance')}
                isInvalid={getErrorMessage(errors, 'quantity') !== undefined}
                style={{
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  height: '100%',
                }}
              />
            </Col>
            <Col xs={6} style={{ paddingLeft: 0 }}>
              <ReactSelect
                options={concentrationTypes
                  .sort((t1, t2) => t1.name.localeCompare(t2.name))
                  .map((v) => ({
                    value: v.symbol,
                    label: v.name,
                  }))}
                styles={{
                  control: (styles) => ({
                    ...styles,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    ...(getErrorMessage(errors, 'quantity') !== undefined
                      ? { borderColor: '#d32f2f' }
                      : {}),
                  }),
                }}
                placeholder="unit"
                value={
                  composition.ConcentrationType
                    ? {
                        value: composition.ConcentrationType.symbol,
                        label: composition.ConcentrationType.name,
                      }
                    : undefined
                }
                onChange={(newValue) => {
                  onSelectConcentrationType(newValue?.value);
                }}
                formatOptionLabel={(option, { context }) =>
                  context === 'value'
                    ? `${option.value}`
                    : `${option.label} - ${option.value}`
                }
                isClearable
              ></ReactSelect>
            </Col>
          </Row>
        </Col>

        <Col lg={2}>
          <Form.Label>Ratio</Form.Label>
          <Form.Control
            value={composition.ratio || ''}
            type="number"
            onChange={onChange.event('ratio')}
            isInvalid={getErrorMessage(errors, 'quantity') !== undefined}
          />
        </Col>
        <Col lg={2}>
          <Form.Label>pH</Form.Label>
          <Form.Control
            value={composition.ph || ''}
            type="number"
            onChange={onChange.event('ph')}
            isInvalid={getErrorMessage(errors, 'quantity') !== undefined}
          />
        </Col>
        <Col lg={2}>
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
            styles={{
              control: (styles) => ({
                ...styles,
                ...(getErrorMessage(errors, 'Component') !== undefined
                  ? { borderColor: '#d32f2f' }
                  : {}),
              }),
            }}
          />
        </Col>
        <Col lg={2}>
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
            styles={{
              control: (styles) => ({
                ...styles,
                ...(getErrorMessage(errors, 'Component') !== undefined
                  ? { borderColor: '#d32f2f' }
                  : {}),
              }),
            }}
          />
        </Col>
        <Col lg={'auto'}>
          <Button
            variant={'danger'}
            size="sm"
            onClick={onRemove}
            style={{ width: '100%', marginTop: 5, marginBottom: 5 }}
          >
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
    </>
  );
}
