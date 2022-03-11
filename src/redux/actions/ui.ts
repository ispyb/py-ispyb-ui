import { DispacherType } from 'components/buttons/actiontogglebutton';
export const setTechniqueVisibleSessionTable: DispacherType = (actionType, visible) => {
  return {
    type: actionType,
    visible,
  };
};
