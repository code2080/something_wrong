import { createSelector } from 'reselect';
import _ from 'lodash';

const selectUsers = state => state.users;

export const getUsers = (permissions = []) => createSelector(
  [selectUsers],
  users => {
    permissions = Array.isArray(permissions) ? permissions : [permissions];
    return permissions
      ? _.keyBy(_.flatMap(users)
        .filter(user =>
          permissions.some(permission =>
            user.permissions.includes(permission)
          )
        ), '_id')
      : users;
  }
);
