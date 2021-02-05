import { createSelector } from 'reselect';

const selectAuthUserPermissions = state => state.auth.user.permissions;
const selectAuthedUser = state => state.auth.user;

export const hasPermission = (permission = '') => createSelector(
  [selectAuthUserPermissions],
  permissions => permissions.includes(permission)
);

export const selectAuthedUserId = createSelector(
  selectAuthedUser,
  user => user.id,
);
