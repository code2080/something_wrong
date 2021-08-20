import { teCoreActions } from '../../Constants/teCoreActions.constants';

const apiSupportsFunc = (api, callname) =>
  api &&
  Object.prototype.hasOwnProperty.call(api, callname) &&
  typeof api[callname] === 'function';

const callCanBeMocked = (actionKey) =>
  teCoreActions &&
  teCoreActions[actionKey] &&
  teCoreActions[actionKey].mockFunction &&
  typeof teCoreActions[actionKey].mockFunction === 'function';

const executeAPICall = async (api, callname, args, actionKey) => {
  if (apiSupportsFunc(api, callname)) {
    const _retVal = await api[callname](...args);
    return _retVal;
  }
  if (callCanBeMocked(actionKey)) {
    console.info('Call is unsupported but can be mocked');
    console.info(`Mocking ${actionKey} with arguments:`, args);
    return teCoreActions[actionKey].mockFunction(...args);
  }
  console.info('Call is unsupported and can not be mocked');
  console.info(`Suppressing call to ${actionKey} with arguments:`, args);
  // unsupportedFuncCall(callname);
};

const configureTECoreAPI = (teCoreAPI) => {
  const apiActions = Object.keys(teCoreActions).reduce(
    (actions, actionKey) => ({
      ...actions,
      [teCoreActions[actionKey].callname]: (...args) =>
        executeAPICall(
          teCoreAPI,
          [teCoreActions[actionKey].callname],
          args,
          actionKey,
        ),
    }),
    {},
  );
  const utilityActions = {
    listSupportedActions: () => Object.keys(teCoreAPI) || [],
    apiSupportsFunc: (callname) => apiSupportsFunc(teCoreAPI, callname),
    getCompatibleFunctionsForElement: (elementId) =>
      Object.keys(teCoreActions).filter(
        (actionKey) =>
          teCoreActions[actionKey].compatibleWith &&
          teCoreActions[actionKey].compatibleWith.indexOf(elementId) > -1,
      ),
  };
  return {
    ...apiActions,
    ...utilityActions,
  };
};

export default configureTECoreAPI;
