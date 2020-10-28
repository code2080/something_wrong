import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

// SELECTORS
import { selectExtIdLabel } from '../../Redux/TE/te.selectors';
import { selectLabelField } from '../../Redux/Integration/integration.selectors';

// CONSTANTS
import {
  objectRequestTypeToText,
  requestStatusToIcon,
  RequestStatus,
  RequestType,
} from '../../Constants/objectRequest.constants';

export const ObjectRequestStatusIcon = ({ status }) => requestStatusToIcon[status] || requestStatusToIcon[RequestStatus.PENDING];

export const ObjectRequestLabel = ({ request }) => {
  const labelField = useSelector(selectLabelField(request.datasource));
  const extIdLabel = useSelector(state => selectExtIdLabel(state)('objects', request.replacementObjectExtId || request.objectExtId));
  const firstFieldLabel = request.objectRequest[labelField] || _.head(Object.values(request.objectRequest));
  return extIdLabel || firstFieldLabel || 'N/A';
}
export const ObjectRequestType = ({ type }) => <span className={`requestType`} style={{ color: type === RequestType.MISSING_OBJECT ? 'red' : 'green' }} >{objectRequestTypeToText[type] || 'N/A'}</span>;

const ObjectRequestValue = ({ request }) => (
  <div className={'object_request'}>
    <ObjectRequestStatusIcon status={request.status} />
    <ObjectRequestLabel request={request} />
    <ObjectRequestType type={request.type} />
  </div>
);
export default ObjectRequestValue;