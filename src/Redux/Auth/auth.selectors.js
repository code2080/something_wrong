import { createSelector } from 'reselect';

const selectAuthUserPermissions = state => state.auth.user.permissions;

export const hasPermission = (permission = '') => createSelector(
  [selectAuthUserPermissions],
  permissions => permissions.includes(permission)
);
