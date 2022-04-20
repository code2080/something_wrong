import axios from 'axios';
import { notification } from 'antd';

// SERVICES
import { getEnvParams } from '../configs';

// TYPES
import { TOption, TAPIRequest, TAPIRequestShorthand } from '../Types/api.type';
import { EExternalServices } from 'Types/externalServices.enum';
import { getToken } from 'Utils/tokenHelpers';

/**
 * @function prepareOption
 * @description wrapper function to axios option object
 * @param {String} method request HTTP method
 * @param {Any} data data to pass in request
 * @param {Bool} requiresAuth whehter bearer token is required
 * @param {Obj} headers additional headers to be sent
 * @param {Obj} params explicitely set params
 * @returns {String}
 */
const prepareOption = async (
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  data: any,
  requiresAuth: Boolean,
  headers: any,
  params: any,
): Promise<TOption> => {
  const option: TOption = {
    method,
    headers: {
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
    body: {},
  };

  if (requiresAuth) {
    const token = await getToken();
    option.headers = {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
      ...headers,
    };
  }

  if (data) {
    if (method === 'GET') {
      option.params = { ...data, ...(params || {}) };
    } else {
      option.data = { ...data };
      if (params) option.params = { ...params };
    }
  }
  return option;
};

const getServiceUrl = (service: EExternalServices) => {
  switch (service) {
    case EExternalServices.AM_BE:
      return getEnvParams().AM_BE_URL;
    case EExternalServices.PREFERENCES_BE:
      return getEnvParams().API_URL;
  }
};

/**
 * @function getAPIUrl
 * @description returns URL for TE Preferences API depending on environment
 * @param {EExternalServices} service
 * @param {String} endpoint route to be called
 * @returns {String}
 */
const getAPIUrl = (service: EExternalServices, endpoint: string): string => {
  const serviceUrl = getServiceUrl(service);
  if (endpoint.search('http://') > -1 || endpoint.search('https://') > -1)
    return endpoint;
  return `${serviceUrl}${endpoint}`;
};

const apiRequest = async ({
  method,
  endpoint,
  absoluteUrl = false,
  data,
  params = null,
  requiresAuth = true,
  headers,
  successMessage = null,
  service = EExternalServices.AM_BE,
}: TAPIRequest) => {
  const fullUrl = !absoluteUrl ? getAPIUrl(service, endpoint) : endpoint;

  const option = await prepareOption(
    method,
    data,
    requiresAuth,
    headers,
    params,
  );
  return axios(fullUrl, option)
    .then((response: any) => {
      if (successMessage) {
        const msg: any =
          typeof successMessage === 'function'
            ? successMessage(response.data)
            : successMessage;
        notification.success({
          getContainer: () => document.getElementById('te-prefs-lib') as HTMLElement,
          message: 'Success',
          description: msg,
        });
      }
      return response.data;
    })
    .catch((error: any) => {
      notification.error({
        message: 'Error',
        description: `An error happened executing your request. Please try again`,
        getContainer: () =>
          document.getElementById('te-prefs-lib') as HTMLElement,
      });
      // Trow error again so failure handler of action triggers
      throw new Error(error);
    });
};

const exports = {
  get: async ({
    endpoint,
    absoluteUrl = false,
    data,
    requiresAuth = true,
    headers,
    successMessage = null,
    service,
  }: TAPIRequestShorthand) =>
    apiRequest({
      method: 'GET',
      endpoint,
      absoluteUrl,
      data,
      requiresAuth,
      headers,
      successMessage,
      service,
    }),
  post: async ({
    endpoint,
    absoluteUrl = false,
    data,
    requiresAuth = true,
    headers,
    params,
    successMessage = null,
    service,
  }: TAPIRequestShorthand) =>
    apiRequest({
      method: 'POST',
      endpoint,
      absoluteUrl,
      data,
      requiresAuth,
      headers,
      params,
      successMessage,
      service,
    }),
  put: async ({
    endpoint,
    absoluteUrl = false,
    data,
    requiresAuth = true,
    headers,
    params,
    successMessage = null,
    service,
  }: TAPIRequestShorthand) =>
    apiRequest({
      method: 'PUT',
      endpoint,
      absoluteUrl,
      data,
      requiresAuth,
      headers,
      params,
      successMessage,
      service,
    }),
  patch: async ({
    endpoint,
    absoluteUrl = false,
    data,
    requiresAuth = true,
    headers,
    params,
    successMessage = null,
    service,
  }: TAPIRequestShorthand) =>
    apiRequest({
      method: 'PATCH',
      endpoint,
      absoluteUrl,
      data,
      requiresAuth,
      headers,
      params,
      successMessage,
      service,
    }),
  delete: async ({
    endpoint,
    absoluteUrl = false,
    data,
    requiresAuth = true,
    headers,
    successMessage = null,
    service,
  }: TAPIRequestShorthand) =>
    apiRequest({
      method: 'DELETE',
      endpoint,
      absoluteUrl,
      data,
      requiresAuth,
      headers,
      successMessage,
      service,
    }),
};

export default exports;
