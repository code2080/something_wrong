import { createSelector } from 'reselect';
import _ from 'lodash';

const selectAuthUserPermissions = state => state.auth.user.permissions;

export const hasPermission = (permission = '') => createSelector(
  [selectAuthUserPermissions],
  permissions => permissions.includes(permission)
);