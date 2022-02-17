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
      const submissionIds = Object.keys(submissions);
      return requests
        .filter(({ formInstanceId }) => submissionIds.includes(formInstanceId))
        .map((item) => ({
          ...item,
          submitter: `${submissions[item.formInstanceId]?.firstName || ''} ${
            submissions[item.formInstanceId]?.lastName || ''
          }`,
          scopedObject: submissions[item.formInstanceId].scopedObject,
        }));
    },
  );
