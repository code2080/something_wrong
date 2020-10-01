import React from 'react';
import { Icon } from 'antd';
import { requestStatusToIcon, RequestStatus } from './ObjectRequest.constants';
import { teCoreCallnames } from './teCoreActions.constants';
import _ from 'lodash';

export const objectRequestActions = {
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  REPLACE: 'REPLACE',
  SELECT: 'SELECT',
  //SEARCH: 'SEARCH', // TODO: scope the search feature. What is its' purpose? DEV-5290
};

export const objectRequestActionToStatus = {
  [objectRequestActions.ACCEPT]: RequestStatus.ACCEPTED,
  [objectRequestActions.DECLINE]: RequestStatus.DECLINED,
  [objectRequestActions.REPLACE]: RequestStatus.REPLACED,
}

export const objectRequestActionLabels = {
  [objectRequestActions.ACCEPT]: 'Accept',
  [objectRequestActions.DECLINE]: 'Decline',
  [objectRequestActions.REPLACE]: 'Replace',
  [objectRequestActions.SELECT]: 'Select object',
  [objectRequestActions.SEARCH]: 'Search',
};

export const objectRequestActionIcon = {
  [objectRequestActions.ACCEPT]: requestStatusToIcon[RequestStatus.ACCEPTED],
  [objectRequestActions.DECLINE]: requestStatusToIcon[RequestStatus.DECLINED],
  [objectRequestActions.REPLACE]: requestStatusToIcon[RequestStatus.REPLACED],
  [objectRequestActions.SELECT]: <Icon type='select' size='small' />,
  [objectRequestActions.SEARCH]: <Icon type='search' size='small' style={{ color: 'rgb(0,0,0)' }} />,
};

export const externalobjectRequestActionMapping = {
  [objectRequestActions.ACCEPT]: teCoreCallnames.REQUEST_HANDLE_OBJECT_REQUEST,  
  [objectRequestActions.DECLINE]: _.noop,  
  [objectRequestActions.REPLACE]: teCoreCallnames.REQUEST_REPLACE_OBJECT,  
  [objectRequestActions.SELECT]: teCoreCallnames.SELECT_OBJECT,  
  [objectRequestActions.SEARCH]: teCoreCallnames.REQUEST_GET_OBJECT_FROM_FILTER,
};
