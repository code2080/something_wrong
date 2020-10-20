import { createSelector } from 'reselect';
import _ from 'lodash';

import { getSubmissionValues } from '../../Redux/FormSubmissions/formSubmissions.selectors';

const selectObjectRequestsState = state => state.objectRequests;
const getObjectRequestByValue = (objReqList, value) => objReqList.find(req => req._id === value || req.objectExtId === value);
const getObjectRequestsByValues = (objReqList, values) => values.reduce(
  (objReqs, value) => {
    const objReq = getObjectRequestByValue(objReqList, value);
    return objReq ? [...objReqs, objReq] : objReqs;
  }, []);
    

export const selectObjectRequests = () =>
  createSelector(selectObjectRequestsState, state => state.objectRequest);

export const selectObjectRequestsList = () => createSelector(selectObjectRequestsState, objReqs => objReqs.list);

export const selectFormInstanceObjectRequests = (formId, formInstanceId) =>
  createSelector(selectObjectRequestsList(), getSubmissionValues(formId, formInstanceId),
    (requests, submissionValues) =>
      requests.filter(req =>
        req.formInstanceId === formInstanceId
        && submissionValues.includes(req._id)
      )
  );

export const selectObjectRequestsByValues = values =>
  createSelector(selectObjectRequestsState, objectRequests =>
    getObjectRequestsByValues(objectRequests.list, values)
  );

export const selectObjectRequestByValue = value =>
  createSelector(selectObjectRequestsState, objectRequests => {
    getObjectRequestByValue(objectRequests.list, value)
  });
