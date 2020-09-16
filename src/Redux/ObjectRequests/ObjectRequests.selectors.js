import { createSelector } from 'reselect';
import _ from 'lodash';

const selectObjectRequestsState = state => state.objectRequests;
const getRequestsForSubmission = (objectRequests, formInstanceId) => objectRequests.filter(request => request.formInstanceId === formInstanceId);
const getObjectRequestByValue = (objReqList, value) => objReqList.find(req => req._id === value || req.objectExtId === value);
const getObjectRequestsByValues = (objReqList, values) => values.reduce(
  (objReqs, value) => {
    const objReq = getObjectRequestByValue(objReqList, value);
    return objReq ? [...objReqs, objReq] : objReqs;
  }, []);
    

export const selectObjectRequests = () =>
  createSelector(selectObjectRequestsState, state => state.objectRequest);

export const selectObjectRequestsList = () =>
  createSelector(selectObjectRequestsState, state => state.list);

export const selectFormInstanceObjectRequests = (formInstanceId) =>
  createSelector(selectObjectRequestsState, state => {
    return getRequestsForSubmission(state.list, formInstanceId);
  });

export const selectObjectRequestsByValues = values =>
  createSelector(selectObjectRequestsState, objectRequests =>
    getObjectRequestsByValues(objectRequests.list, values)
  );

export const selectObjectRequestByValue = value =>
  createSelector(selectObjectRequestsState, objectRequests => {
    getObjectRequestByValue(objectRequests.list, value)
  });
