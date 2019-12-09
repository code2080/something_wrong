// import React from 'react';
import { notification } from 'antd';
import { teCoreActions } from '../../Constants/teCoreActions.constants';

const apiSupportsFunc = (api, callname) => api && api.hasOwnProperty(callname) && typeof api[callname] === 'function';

const unsupportedFuncCall = callname => notification.error({
  getContainer: () => document.getElementById('te-prefs-lib'),
  message: 'Unsupported call',
  description: `${callname} is not implemennted in the provided TE Core API`,
});

const executeAPICall = async (api, callname, args) => {
  if (apiSupportsFunc(api, callname)) {
    const _retVal = await api[callname](args);
    return _retVal;
  }
  return unsupportedFuncCall(callname);
};

const configureTECoreAPI = teCoreAPI => {
  const apiActions = Object.keys(teCoreActions).reduce(
    (actions, actionKey) => ({
      ...actions,
      [teCoreActions[actionKey].callname]:
        args => executeAPICall(teCoreAPI, [teCoreActions[actionKey].callname], args),
    })
    , {});
  const utilityActions = {
    listSupportedActions: () => Object.keys(teCoreAPI) || [],
    getCompatibleFunctionsForElement:
      elementId => Object.keys(teCoreActions).filter(
        actionKey =>
          teCoreActions[actionKey].compatibleWith &&
          teCoreActions[actionKey].compatibleWith.indexOf(elementId) > -1
      ),
  };
  return {
    ...apiActions,
    ...utilityActions,
  };
}

export default configureTECoreAPI;
