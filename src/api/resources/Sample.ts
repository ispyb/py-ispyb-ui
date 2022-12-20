import createPaginatedResource from './Base/Paginated';
import { SampleBase } from 'models/Sample';
import { ComponentBase } from 'models/Component';

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
