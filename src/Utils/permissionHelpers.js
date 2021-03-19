import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../Constants/permissions.constants';

export const hasAssistedSchedulingPermissions = () => {
  try {
    const state = window.tePrefsLibStore.getState();
    const {
      auth: {
        user: { permissions },
      },
    } = state;
    return permissions.indexOf(ASSISTED_SCHEDULING_PERMISSION_NAME) > -1;
  } catch (error) {
    return false;
  }
};
