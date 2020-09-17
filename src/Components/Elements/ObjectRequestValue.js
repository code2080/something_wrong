import React from 'react';
import { Icon } from 'antd';

import { objectRequestTypeToText } from '../../Constants/ObjectRequest.constants';

const ObjectRequestStatus = status => <Icon type="question" style={{ color: 'rgba(255,0,0, 0.8)' }} />

export const ObjectRequestValue = ({ request }) => <React.Fragment>
  <ObjectRequestStatus status='shouldBeRequest.status' />
  <span>{request.objectExtId}</span>
  <span>{objectRequestTypeToText[request.type]}</span>
</React.Fragment>