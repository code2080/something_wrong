import { createSelector } from 'reselect';
import { ActivityDesign } from '../../Models/ActivityDesign.model';

const selectActivityDesigner = state => state.activityDesigner;

export const selectAllDesigns = createSelector(
  selectActivityDesigner,
  activityDesigns => activityDesigns
);

export const selectDesignForForm = createSelector(
  selectActivityDesigner,
  activityDesigns => formId => activityDesigns[formId] || new ActivityDesign({ name: `Mapping form ${formId}`, formId })
);
