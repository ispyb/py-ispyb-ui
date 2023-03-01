import createPaginatedResource from './Base/Paginated';
import { ConcentrationTypeBase, SampleBase } from 'models/Sample';
import { ComponentBase } from 'models/Component';
import { createAuthenticatedResource } from './Base/Authenticated';

export class SampleEntity extends SampleBase {
  readonly blSampleId: number;

  pk() {
    return this.blSampleId?.toString();
  }
}

export const SampleResource = createPaginatedResource({
  path: '/samples/:blSampleId',
  schema: SampleEntity,
});

export class ComponentEntity extends ComponentBase {
  readonly componentId: number;

  pk() {
    return this.componentId?.toString();
  }
}

export const ComponentResource = createPaginatedResource({
  path: '/samples/components/:componentId',
  schema: ComponentEntity,
});

class ConcentrationTypeEntity extends ConcentrationTypeBase {
  readonly concentrationTypeId: number;

  pk() {
    return this.concentrationTypeId?.toString();
  }
}

export const ConcentrationTypeResource = createAuthenticatedResource({
  path: '/samples/concentration/types/:concentrationTypeId',
  schema: ConcentrationTypeEntity,
});
