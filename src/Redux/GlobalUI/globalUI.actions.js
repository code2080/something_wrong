import {
  SET_BREADCRUMBS,
  BEGIN_EXTERNAL_ACTION,
  END_EXTERNAL_ACTION,
} from './globalUI.actionTypes';

export const setBreadcrumbs = fragments => ({
  type: SET_BREADCRUMBS,
  payload: { fragments },
});

export const beginExternalAction = (activityId, prop) => ({
  type: BEGIN_EXTERNAL_ACTION,
  payload: { activityId, prop },
});

export const endExternalAction = () => ({
  type: END_EXTERNAL_ACTION
});
