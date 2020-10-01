import React from 'react';
import { Icon } from 'antd';
import { requestStatusToIcon, RequestStatus, RequestType } from './ObjectRequest.constants';
import { teCoreCallnames } from './teCoreActions.constants';
import _ from 'lodash';

import { getTECoreAPIPayload } from '../Redux/Integration/integration.selectors';
import { updateObjectRequest} from '../Redux/ObjectRequests/ObjectRequests.actions';

export const objectRequestActions = {
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  REPLACE: 'REPLACE',
  REVERT: 'REVERT',
  SELECT: 'SELECT',
  //SEARCH: 'SEARCH', // TODO: scope the search feature. What is its' purpose? DEV-5290
};

export const objectRequestActionCondition = request => ({
  [objectRequestActions.ACCEPT]: request.status === 'pending',
  [objectRequestActions.DECLINE]: request.status === 'pending',
  [objectRequestActions.REPLACE]: request.status === 'pending',
  [objectRequestActions.REVERT]: request.status !== 'pending',
  [objectRequestActions.SELECT]: request.replacementObjectExtId || request.objectExtId,
  [objectRequestActions.FILTER]: request.status === 'pending',
});

export const objectRequestActionToStatus = {
  [objectRequestActions.ACCEPT]: RequestStatus.ACCEPTED,
  [objectRequestActions.DECLINE]: RequestStatus.DECLINED,
  [objectRequestActions.REPLACE]: RequestStatus.REPLACED,
}

export const objectRequestActionLabels = {
  [objectRequestActions.ACCEPT]: 'Accept',
  [objectRequestActions.DECLINE]: 'Decline',
  [objectRequestActions.REPLACE]: 'Replace',
  [objectRequestActions.REVERT]: 'Revert',
  [objectRequestActions.SELECT]: 'Select',
  [objectRequestActions.FILTER]: 'Filter fields',
};

export const objectRequestActionIcon = {
  [objectRequestActions.ACCEPT]: requestStatusToIcon[RequestStatus.ACCEPTED],
  [objectRequestActions.DECLINE]: requestStatusToIcon[RequestStatus.DECLINED],
  [objectRequestActions.REPLACE]: requestStatusToIcon[RequestStatus.REPLACED],
  [objectRequestActions.REVERT]: <Icon type='undo' size='small' />,
  [objectRequestActions.SELECT]: <Icon type='select' size='small' />,
  [objectRequestActions.FILTER]: <Icon type='filter' size='small' />,
};

export const objectRequestOnClick = ({ request, coreCallback, dispatch, teCoreAPI }) => ({ key }) => {
  let payload = {
    callback: coreCallback(key)
  };
  const objectRequestActionClickFunc = {
    [objectRequestActions.ACCEPT]: () => {
      payload = {
        ...payload,
        extId: request.objectExtId,
        fields: request.objectRequest,
        objectType: request.datasource,
        requestType: request.type,
      };
      teCoreAPI[teCoreCallnames.REQUEST_HANDLE_OBJECT_REQUEST](payload);
    },
    [objectRequestActions.DECLINE]: () => {
      const declinedRequest = {
        ...request,
        status: RequestStatus.DECLINED,
      };
      updateObjectRequest(declinedRequest)(dispatch);
    },
    [objectRequestActions.REPLACE]: () => {
      payload = {
        ...payload,
        objectExtId: request.replacementObjectExtId || request.objectExtId,
        typeExtId: request.datasource,
      };
      teCoreAPI[teCoreCallnames.REQUEST_REPLACE_OBJECT](payload);
    },
    [objectRequestActions.REVERT]: () => {
      const revertedRequest = {
        ...request,
        status: RequestStatus.PENDING,
        replacementObjectExtId: null
      };
      updateObjectRequest(revertedRequest)(dispatch);
    },
    [objectRequestActions.SELECT]: () => {
      payload = getTECoreAPIPayload(request.replacementObjectExtId || request.objectExtId, `${request.datasource},object`);
      teCoreAPI[teCoreCallnames.SELECT_OBJECT](payload);
    },
    [objectRequestActions.FILTER]: () => { 
      teCoreCallnames.SELECT_OBJECT 
    },
  }
  objectRequestActionClickFunc[key]();
};
