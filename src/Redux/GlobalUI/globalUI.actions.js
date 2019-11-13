import {
  SET_BREADCRUMBS,
} from './globalUI.actionTypes';

export const setBreadcrumbs = fragments => ({
  type: SET_BREADCRUMBS,
  payload: { fragments },
});
