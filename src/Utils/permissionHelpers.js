import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../Constants/permissions.constants';

/**
 * @deprecated use usePermission(ASSISTED_SCHEDULING_PERMISSION_NAME) when possible (trying to minimize usage of window.teprefslibstore)
 */
export const hasAssistedSchedulingPermissions = () => {
  try {
    const state = window.tePrefsLibStore.getState();
    const {
      auth: {
        user: { permissions },
      },
    } = state;
    return !permissions.indexOf(ASSISTED_SCHEDULING_PERMISSION_NAME) > -1;
  } catch (error) {
    return false;
  }
};
