import { createSelector } from 'reselect';
import { ActivityDesign } from '../../Models/ActivityDesign.model';

const selectActivityDesigner = (state) => state.activityDesigner;

export const selectAllDesigns = createSelector(
  selectActivityDesigner,
  (activityDesigns) => activityDesigns,
);

export const selectDesignForForm = createSelector(
  selectActivityDesigner,
  (activityDesigns) => (formId: string) =>
    activityDesigns[formId] ??
    new ActivityDesign({ name: `Mapping form ${formId}`, formId }),
);

export const selectMappedTypesForForm = (formId: string) => (state: any) =>
  Object.keys(state.activityDesigner?.[formId]?.objects || []);

export const selectActivityDesignForForm = (formId: string) => (state: any) =>
  state.activityDesigner[formId] || undefined;
