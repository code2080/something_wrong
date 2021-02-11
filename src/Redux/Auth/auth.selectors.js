import { createSelector } from 'reselect';

const selectAuthUserPermissions = state => state.auth.user.permissions;
const selectAuthedOrg = state => state.auth.org;

export const selectOrgId = createSelector(
  selectAuthedOrg,
  org => org._id,
);

export const hasPermission = (permission = '') => createSelector(
  [selectAuthUserPermissions],
  permissions => permissions.includes(permission)
);
