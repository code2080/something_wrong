import React from 'react';
import { Icon } from 'antd';
import { teCoreCallnames } from './teCoreActions.constants';
import _ from 'lodash';

export const RequestStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  REPLACED: 'replaced',
};

export const requestStatusToIcon = {
  [RequestStatus.PENDING]: <Icon type="question" style={{ color: 'rgba(255,0,0, 0.8)' }} />,
  [RequestStatus.ACCEPTED]: <Icon type="check" style={{ color: 'rgba(0,255,0, 0.8)' }} />,
  [RequestStatus.DECLINED]: <Icon type="close" style={{ color: 'rgba(255,0,0, 0.8)' }} />,
  [RequestStatus.REPLACED]: <Icon type="swap" style={{ color: 'rgba(0,0,0, 0.8)' }} />,
};


// TODO: Move actions into its' own file?
export const objectRequestActions = {
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  REPLACE: 'REPLACE',
  SEARCH: 'SEARCH', // TODO: scope the search feature. What is its' purpose?
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
  [objectRequestActions.SEARCH]: 'Search',
};

export const objectRequestActionIcon = {
  [objectRequestActions.ACCEPT]: requestStatusToIcon[RequestStatus.ACCEPTED],
  [objectRequestActions.DECLINE]: requestStatusToIcon[RequestStatus.DECLINED],
  [objectRequestActions.REPLACE]: requestStatusToIcon[RequestStatus.REPLACED],
  [objectRequestActions.SEARCH]: <Icon type="search" size='small' style={{ color: 'rgb(0,0,0)' }} />,
};

export const externalobjectRequestActionMapping = {
  [objectRequestActions.ACCEPT]: teCoreCallnames.REQUEST_HANDLE_OBJECT_REQUEST,  
  [objectRequestActions.DECLINE]: _.noop,  
  [objectRequestActions.REPLACE]: teCoreCallnames.REQUEST_REPLACE_OBJECT,  
  [objectRequestActions.SEARCH]: teCoreCallnames.REQUEST_GET_OBJECT_FROM_FILTER,  
};

export const RequestType = {
  NEW_OBJECT: 'NEW_OBJECT',
  EDIT_OBJECT: 'EDIT_OBJECT',
  MISSING_OBJECT: 'MISSING_OBJECT',
};

export const objectRequestTypeToText = {
  [RequestType.NEW_OBJECT]: '(NEW)',
  [RequestType.EDIT_OBJECT]: '(EDITED)',
  [RequestType.MISSING_OBJECT]: '(MISSING)'
};