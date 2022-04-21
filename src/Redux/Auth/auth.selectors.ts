import { AEBETA_PERMISSION } from 'Constants/permissions.constants';
import { createSelector } from 'reselect';

const selectAuthUserPermissions = (state) => state.auth.user.permissions;

export const selectAuthedUser = (state) => state.auth.user;
export const selectEnvironment = (state) => state.auth.env ?? 'production';

export const selectOrgId = (state: any) => state.auth.user?.organizationId;

export const hasPermission = (permission = '') =>
  createSelector([selectAuthUserPermissions], (permissions): boolean =>
    permissions.includes(permission),
  );

/**
 * Will return true if the app is running outside of production/staging.
 * Currently used as a feature flag
 */
export const selectIsBetaOrDev = (state) =>
  !['production', 'staging'].includes(selectEnvironment(state)) &&
  hasPermission(AEBETA_PERMISSION)(state);

export const selectAuthedUserId = createSelector(
  selectAuthedUser,
  (user) => user.id,
);

export const selectCoreUserId = (state): number =>
  state?.auth?.coreUserId ?? -1;
