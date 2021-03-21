import React from 'react';
import {
  QuestionOutlined,
  CheckOutlined,
  CloseOutlined,
  SwapOutlined,
} from '@ant-design/icons';

export const RequestStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  REPLACED: 'replaced',
};

const styleAddOn = { color: 'rgba(255,0,0, 0.8)', marginRight: '0.2rem' };
export const requestStatusToIcon = {
  [RequestStatus.PENDING]: <QuestionOutlined style={styleAddOn} />,
  [RequestStatus.ACCEPTED]: <CheckOutlined />,
  [RequestStatus.DECLINED]: <CloseOutlined />,
  [RequestStatus.REPLACED]: <SwapOutlined />,
};

export const RequestType = {
  NEW_OBJECT: 'NEW_OBJECT',
  EDIT_OBJECT: 'EDIT_OBJECT',
  MISSING_OBJECT: 'MISSING_OBJECT',
};

export const objectRequestTypeToText = {
  [RequestType.NEW_OBJECT]: '(NEW)',
  [RequestType.EDIT_OBJECT]: '(EDITED)',
  [RequestType.MISSING_OBJECT]: '(MISSING)',
};

export const objectRequestTypeToPlainText = {
  [RequestType.NEW_OBJECT]: 'New',
  [RequestType.EDIT_OBJECT]: 'Edit',
  [RequestType.MISSING_OBJECT]: 'Missing',
};
