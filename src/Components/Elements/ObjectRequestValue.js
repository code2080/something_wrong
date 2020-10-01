import React from 'react';
import { useSelector } from 'react-redux';
import { Menu } from 'antd';
import _ from 'lodash';

// SELECTORS
import { selectExtIdLabel } from '../../Redux/TE/te.selectors';
import { selectLabelField } from '../../Redux/Integration/integration.selectors';

// CONSTANTS
import {
  objectRequestTypeToText,
  requestStatusToIcon,
  RequestStatus,
  RequestType
} from '../../Constants/objectRequest.constants';

import {
  objectRequestActions,
  objectRequestActionIcon,
  objectRequestActionLabels,
} from '../../Constants/objectRequestActions.constants';

const ObjectRequestStatusIcon = ({ status }) => requestStatusToIcon[status] || requestStatusToIcon[RequestStatus.PENDING];

const ObjectRequestLabel = ({ request }) => {
  const labelField = useSelector(selectLabelField(request.datasource));
  const extIdLabel = useSelector(state => selectExtIdLabel(state)('objects', request.replacementObjectExtId || request.objectExtId));
  const firstFieldLabel = request.objectRequest[labelField] || _.head(Object.values(request.objectRequest));
  return extIdLabel || firstFieldLabel || 'N/A';
}
const ObjectRequestType = ({ type }) => <span className={`requestType ${type === RequestType.MISSING_OBJECT && 'missingObject'}`} >{objectRequestTypeToText[type] || 'N/A'}</span>;

export const ObjectRequestValue = ({ request }) => (
  <div className={'object_request'}>
    <ObjectRequestStatusIcon status={request.status} />
    <ObjectRequestLabel request={request} />
    <ObjectRequestType type={request.type} />
  </div>
)

// This is a function instead of a component because antd styling didn't apply properly when it was a component
export const objectRequestDropdownMenu = ({ onClick }) => <Menu
  getPopupContainer={() => document.getElementById('te-prefs-lib')}
  onClick={onClick}
>
  {/* TODO: fix this inline styling? */}
  <span style={{ padding: '5px 12px', cursor:'default' }}>Execute request...</span>
  <Menu.Divider />
  {_.flatMap(objectRequestActions).map(action =>
    <Menu.Item key={action} >
      {objectRequestActionIcon[action]} {objectRequestActionLabels[action]}
    </Menu.Item>
  )}
</Menu>