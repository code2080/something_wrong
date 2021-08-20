import { createSelector } from 'reselect';

const selectAuthUserPermissions = (state) => state.auth.user.permissions;
const selectAuthedUser = (state) => state.auth.user;
const selectAuthedOrg = (state) => state.auth.org;

export const selectEnvironment = (state) => state.auth.env ?? 'production';
export const selectIsBetaOrDev = (state) =>
  !['production', 'staging'].includes(selectEnvironment(state));

export const selectOrgId = createSelector(selectAuthedOrg, (org) => org._id);

export const hasPermission = (permission = '') =>
  createSelector([selectAuthUserPermissions], (permissions): boolean =>
    permissions.includes(permission),
  );

export const selectAuthedUserId = createSelector(
  selectAuthedUser,
  (user) => user.id,
);
