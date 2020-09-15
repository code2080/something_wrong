import { createSelector } from 'reselect';
import { keyBy, curry } from 'lodash';

const getRequestsForSubmission = (objectRequests, formInstanceId) => objectRequests.filter(request => request.formInstanceId === formInstanceId);

const selectObjectRequestsState = state => state.objectRequests;

export const selectObjectRequests = () =>
  createSelector(selectObjectRequestsState, state => state.objectRequest);

export const selectObjectRequestsList = () =>
  createSelector(selectObjectRequestsState, state => state.list);

export const selectFormInstanceObjectRequests = (formInstanceId) =>
  createSelector(selectObjectRequestsState, state => {
    return getRequestsForSubmission(state.list, formInstanceId);
  });

export const selectObjectRequestsByValue = curry((formInstanceId, value) =>
  createSelector(selectObjectRequestsState, (state) => {
    if (!formInstanceId) return [];
    const objectRequests = getRequestsForSubmission(state.list, formInstanceId);
    const indexedByObjectExtId = keyBy(objectRequests, 'objectExtId');
    const indexedById = keyBy(objectRequests, '_id');
    return value.map(val => indexedByObjectExtId[val] || indexedById[val]);
  }));

export const selectObjectRequestByValue = curry((formInstanceId, value) =>
  createSelector(selectObjectRequestsState, state => {
    if (!formInstanceId) return null;
    return getRequestsForSubmission(state.lis, formInstanceId).find(
      obj => obj.objectExtId === value || obj._id === value
    );
  }));
