import { createSelector } from 'reselect';
import { submissionsState } from '../FormSubmissions/formSubmissions.selectors';
import { ObjectRequest } from './ObjectRequests.types';

interface ObjectRequestsState {
  list: ObjectRequest[];
}

const selectObjectRequestsState = (state: any): ObjectRequestsState =>
  state.objectRequests;

export const selectObjectRequestsList = () =>
  createSelector(selectObjectRequestsState, (objectRequest) => {
    return objectRequest.list;
  });

export const selectObjectRequestById = (objectRequestId: string) =>
  createSelector(
    selectObjectRequestsState,
    (objectRequest): ObjectRequest | undefined => {
      return objectRequest.list.find(({ _id }) => _id === objectRequestId);
    },
  );

export const selectFormObjectRequest = (formId: string) =>
  createSelector(
    selectObjectRequestsList(),
    submissionsState,
    (requests, submissionState) => {
      const submissions = submissionState[formId] ?? {};
      const submissionIds = submissions.list || [];
      return requests
        .filter(({ formInstanceId }) => submissionIds.includes(formInstanceId))
        .map((item) => {
          const formInstance = submissions.mapped?.byId[item.formInstanceId];
          return {
            ...item,
            submitter: formInstance?.submitter,
            scopedObject: formInstance?.scopedObject,
          };
        });
    },
  );
