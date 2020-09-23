const ASSISTED_SCHEDULING_PERMISSION_GROUP_NAME = 'pic:assisted';

export const hasAssistedSchedulingPermissions = () => {
  try {
    const state = window.tePrefsLibStore.getState();
    const { auth: { user: { permissions } } } = state;
    return permissions.indexOf(ASSISTED_SCHEDULING_PERMISSION_GROUP_NAME) > -1;
  } catch (error) {
    return false;
  }
};
