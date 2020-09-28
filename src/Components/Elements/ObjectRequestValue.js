import React from 'react';
import { useSelector } from 'react-redux';
import { Menu } from 'antd';
import _ from 'lodash';

// SELECTORS
import { selectExtIdLabel } from '../../Redux/TE/te.selectors';

// CONSTANTS
import {
  objectRequestTypeToText,
  requestStatusToIcon,
  RequestStatus,
  objectRequestActions,
  objectRequestActionIcon,
  objectRequestActionLabels,
  RequestType
} from '../../Constants/objectRequest.constants';

const ObjectRequestStatusIcon = ({ status }) => requestStatusToIcon[status] || requestStatusToIcon[RequestStatus.PENDING];

const ObjectRequestLabel = ({ request }) => {
  // TODO: Make sure the labels are fetched while loading submission, and on return from core.
  const extIdLabel = useSelector(state => selectExtIdLabel(state)('objects', request.replacementObjectExtId || request.objectExtId));
  // TODO: implement core api call to get selected primary field of type. In the meanwhile just use first field listed in obj req
  // TODO: use label field from integration
  // What to display?
  const firstFieldLabel = _.head(Object.values(request.objectRequest));
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