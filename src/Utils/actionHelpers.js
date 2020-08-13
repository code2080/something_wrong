import axios from 'axios';
import { getEnvParams } from '../configs';
import { getToken, deleteToken } from './tokenHelpers';
import { notification } from 'antd';
import React from 'react';
// import { useHistory } from 'react-router-dom';

// Singleton to hold API status
const allApis = {};

/**
 * @function prepareOption
 * @description wrapper function to axios option object
 * @param {String} method request HTTP method
 * @param {String} params params to pass in request
 * @param {Bool} requiresAuth whehter bearer token is required
 * @param {Obj} headers additional headers to be sent
 * @returns {String}
 */
const prepareOption = async (method, params, requiresAuth, headers) => {
  const option = {
    method,
    headers: {
      'Access-Control-Allow-Origin': '*',
      ...headers
    },
    body: {}
  };

  if (requiresAuth) {
    const token = await getToken();
    option.headers = {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
      ...headers
    };
  }

  if (params) {
    if (method === 'GET') {
      option.params = { ...params };
    } else {
      option.data = { ...params };
    }
  }
  return option;
};

/**
 * @function doDispatch
 * @description wrapper function around dispatch thunk action
 * @param {String} endpoint route to be called
 * @returns {String}
 */
function doDispatch(flow, params, data) {
  const { success, dispatch } = flow;
  const finalData = data.data || data;
  if (typeof success === 'function') {
    dispatch(success({ ...finalData, actionMeta: { ...params } }, params));
  }
}

/**
 * @function getAPIUrl
 * @description returns URL for TE Preferences API depending on environment
 * @param {String} endpoint route to be called
 * @returns {String}
 */
const getAPIUrl = endpoint => {
  if (endpoint.search('http://') > -1 || endpoint.search('https://') > -1) {
    return endpoint;
  }
  const { API_URL } = getEnvParams();
  return `${API_URL}${endpoint}`;
};

/**
 * @function refreshToken
 * @description Return a refreshed access token
 * @returns {void}
 */
const refreshToken = async () => {
  // @todo: build refresh token flow
  window.tePrefsLibStore.dispatch({ type: 'LOGIN_FAILURE' });
  await deleteToken();
  console.log('Token refreshing');
};

function createThunkAction({
  method,
  flow,
  endpoint,
  absoluteUrl = false,
  params,
  requiresAuth = true,
  headers,
  successNotification = null
}) {
  const { CancelToken } = axios;
  if (allApis[endpoint]) {
    allApis[endpoint].inprogress = true;
  } else {
    allApis[endpoint] = {
      inprogress: true
    };
  }

  return async function thunk(dispatch, getState) {
    const fullUrl = !absoluteUrl ? getAPIUrl(endpoint) : endpoint;
    const option = await prepareOption(method, params, requiresAuth, headers);
    const { request, failure } = flow;
    if (typeof request === 'function') {
      dispatch(request(params));
    }
    if (
      typeof allApis[endpoint].cancel === 'function' &&
      allApis[endpoint].inprogress
    ) {
      allApis[endpoint].cancel('DUPLICATED_CANCELLED');
      allApis[endpoint].inprogress = false;
    }
    option.cancelToken = new CancelToken(c => {
      allApis[endpoint].cancel = c;
    });

    return axios(fullUrl, option)
      .then(response => {
        allApis[endpoint].inprogress = false;
        doDispatch({ ...flow, dispatch, getState }, params, response.data);
        if (successNotification)
          notification.success({
            getContainer: () => document.getElementById('te-prefs-lib'),
            message: 'Operation completed',
            description: successNotification
          });
      })
      .catch(error => {
        allApis[endpoint].inprogress = false;
        const { response } = error;

        // If call was unauthorized, retry with token
        if (error.message === 'UNAUTHORIZED_CANCELLED') {
          allApis[endpoint].recall = () => {
            option.headers.Authorization = `Bearer ${getToken()}`;
            option.cancelToken = new CancelToken(c => {
              allApis[endpoint].cancel = c;
            });
            return axios(fullUrl, option).then(newResponse => {
              doDispatch(
                { ...flow, dispatch, getState },
                params,
                newResponse.data
              );
            });
          };
        }

        // Display failure message
        if (successNotification)
          notification.error({
            getContainer: () => document.getElementById('te-prefs-lib'),
            message: 'Operation failed',
            description: error.toString(),
            duration: 15
          });

        // If no response, return
        if (!response) return null;

        // Process data
        const { data } = response;
        if (requiresAuth && data.code === 401) {
          Object.keys(allApis).forEach(key => {
            const item = allApis[key];
            if (typeof item.cancel === 'function' && item.inprogress) {
              item.cancel('UNAUTHORIZED_CANCELLED');
            }
            return item;
          });
          return refreshToken();
          // @todo should recall after token's been refreshed
        }

        if (typeof failure === 'function') {
          console.log(data, option.params);
          notification.error({
            getContainer: () => document.getElementById('te-prefs-lib'),
            message: 'API call failed',
            description: (
              <p>
                <b>{data.code}:</b> {data.message}
                <br />
                This is not your fault, it's either a bug or a temporary server
                problem. Please contact TimeEdit if you keep getting this
                message.
                <br />
                (When trying to call {endpoint})
              </p>
            ),
            duration: 15
          });
          dispatch(failure({ ...data }, option.params));
        }
        return null;
      });
  };
}

export const asyncAction = {
  GET: ({
    flow,
    endpoint,
    params,
    requiresAuth = true,
    headers,
    successNotification
  }) =>
    createThunkAction({
      method: 'GET',
      flow,
      endpoint,
      params,
      requiresAuth,
      headers,
      successNotification
    }),
  PUT: ({
    flow,
    endpoint,
    params,
    requiresAuth = true,
    headers,
    successNotification
  }) =>
    createThunkAction({
      method: 'PUT',
      flow,
      endpoint,
      params,
      requiresAuth,
      headers,
      successNotification
    }),
  PATCH: ({
    flow,
    endpoint,
    params,
    requiresAuth = true,
    headers,
    successNotification
  }) =>
    createThunkAction({
      method: 'PATCH',
      flow,
      endpoint,
      params,
      requiresAuth,
      headers,
      successNotification
    }),
  POST: ({
    flow,
    endpoint,
    params,
    requiresAuth = true,
    headers,
    successNotification
  }) =>
    createThunkAction({
      method: 'POST',
      flow,
      endpoint,
      params,
      requiresAuth,
      headers,
      successNotification
    }),
  DELETE: ({
    flow,
    endpoint,
    params,
    requiresAuth = true,
    headers,
    successNotification
  }) =>
    createThunkAction({
      method: 'DELETE',
      flow,
      endpoint,
      params,
      requiresAuth,
      headers,
      successNotification
    })
};
