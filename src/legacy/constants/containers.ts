import { containerType } from 'legacy/models';

// eslint-disable-next-line no-unused-vars
export const containerCapacities: { [k in containerType]: number } = {
  Spinepuck: 10,
  Unipuck: 16,
  PLATE: 96,
  OTHER: 1,
};
