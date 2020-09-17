import React from 'react';
import { Icon } from 'antd';

export const RequestStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  REPLACED: 'REPLACED',
};

export const requestStatusToIcon = {
  [RequestStatus.PENDING]: <Icon type="question" style={{ color: 'rgba(255,0,0, 0.8)' }} />,
  [RequestStatus.ACCEPTED]: <Icon type="check" style={{ color: 'rgba(0,255,0, 0.8)' }} />,
  [RequestStatus.DECLINED]: <Icon type="close" style={{ color: 'rgba(255,0,0, 0.8)' }} />,
  [RequestStatus.REPLACED]: <Icon type="swap" style={{ color: 'rgba(0,0,0, 0.8)' }} />,
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