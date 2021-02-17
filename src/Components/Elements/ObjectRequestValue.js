import React from 'react';
import { PropTypes } from 'prop-types';
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
} from '../../Constants/ObjectRequest.constants';

export const ObjectRequestStatusIcon = ({ status }) => requestStatusToIcon[status] || requestStatusToIcon[RequestStatus.PENDING];

ObjectRequestStatusIcon.propTypes = {
  status: PropTypes.oneOf(Object.values(RequestStatus)),
};

export const ObjectRequestLabel = ({ request, onlyShowRequest = false }) => {
  const labelField = useSelector(selectLabelField(request.datasource));
  const editExtId = request.replacementObjectExtId || request.objectExtId;
  const extIdLabel = useSelector(state => selectExtIdLabel(state)('objects', editExtId));
  const firstFieldLabel = request.objectRequest[labelField] || _.head(Object.values(request.objectRequest));
  return (!onlyShowRequest && extIdLabel !== editExtId && extIdLabel) || firstFieldLabel || 'N/A';
};

ObjectRequestLabel.propTypes = {
  request: PropTypes.object,
  onlyShowRequest: PropTypes.bool,
};

export const ObjectRequestType = ({ type }) => <span className={'requestType'} style={{ color: type === RequestType.MISSING_OBJECT ? 'red' : 'green' }} >{objectRequestTypeToText[type] || 'N/A'}</span>;

ObjectRequestType.propTypes = {
  type: PropTypes.oneOf(Object.values(RequestStatus))
};

const ObjectRequestValue = ({ request }) => (
  <div className={'object_request'}>
    <ObjectRequestStatusIcon status={request.status} />
    <ObjectRequestLabel request={request} />
    <ObjectRequestType type={request.type} />
  </div>
);

ObjectRequestValue.propTypes = {
  request: PropTypes.object,
};

export default ObjectRequestValue;
