// import React from 'react';
import { notification } from 'antd';
import { teCoreActions } from '../../Constants/teCoreActions.constants';

const apiSupportsFunc = (api, callname) => api && api.hasOwnProperty(callname) && typeof api[callname] === 'function';

const callCanBeMocked = actionKey =>
  teCoreActions &&
  teCoreActions[actionKey] &&
  teCoreActions[actionKey].mockFunction &&
  typeof teCoreActions[actionKey].mockFunction === 'function';

const unsupportedFuncCall = callname => notification.error({
  getContainer: () => document.getElementById('te-prefs-lib'),
  message: 'Unsupported call',
  description: `${callname} is not implemented in the provided TE Core API`,
});

const executeAPICall = async (api, callname, args, actionKey) => {
  if (apiSupportsFunc(api, callname)) {
    const _retVal = await api[callname](args);
    return _retVal;
  }
  if (callCanBeMocked(actionKey)) {
    return teCoreActions[actionKey].mockFunction(args);
  }
  return unsupportedFuncCall(callname);
};

const configureTECoreAPI = teCoreAPI => {
  const apiActions = Object.keys(teCoreActions).reduce(
    (actions, actionKey) => ({
      ...actions,
      [teCoreActions[actionKey].callname]:
        args => executeAPICall(teCoreAPI, [teCoreActions[actionKey].callname], args, actionKey),
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
