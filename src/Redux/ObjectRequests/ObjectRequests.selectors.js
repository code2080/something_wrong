import { createSelector } from 'reselect';
import _ from 'lodash';

import { getSubmissionValues } from '../../Redux/FormSubmissions/formSubmissions.helpers';

const selectObjectRequestsState = (state) => state.objectRequests;
const getObjectRequestByValue = (objReqList, value) =>
  objReqList.find((req) => req._id === value || req.objectExtId === value);
export const getFormInstanceForRequest = (request) =>
  createSelector(
    (state) => Object.values(state.submissions),
    (formsubmissions) => {
      const formSubmissions = formsubmissions.map((submission) =>
        Object.values(submission),
      );
      const submissions = formSubmissions.reduce(
        (submissions, formsubmission) => [...submissions, ...formsubmission],
      );
      return submissions.find(
        (submission) => submission._id === request.formInstanceId,
      );
    },
  );

const getObjectRequestsByValues = (objReqList, values) =>
  values.reduce((objReqs, value) => {
    const objReq = getObjectRequestByValue(objReqList, value);
    return objReq ? [...objReqs, objReq] : objReqs;
  }, []);

export const selectObjectRequests = () =>
  createSelector(selectObjectRequestsState, (state) => state.objectRequest);

export const selectObjectRequestsList = () =>
  createSelector(selectObjectRequestsState, (objReqs) => objReqs.list);

export const selectFormInstanceObjectRequests = (formInstance) =>
  createSelector(selectObjectRequestsList(), (requests) =>
    requests.filter(
      (req) =>
        req.formInstanceId === formInstance._id &&
        _.flatMap(getSubmissionValues(formInstance), (sectionData) =>
          _.flatten(sectionData.sectionValues),
        ).includes(req._id),
    ),
  );

export const selectObjectRequestsByValues = (values) =>
  createSelector(selectObjectRequestsState, (objectRequests) =>
    getObjectRequestsByValues(objectRequests.list, values),
  );

export const selectObjectRequestByValue = (value) =>
  createSelector(selectObjectRequestsState, (objectRequests) => {
    getObjectRequestByValue(objectRequests.list, value);
  });

export const getSectionsForObjectRequest = (request) =>
  createSelector(
    (state) => getSubmissionValues(getFormInstanceForRequest(request)(state)),
    (submissionValues) =>
      submissionValues.reduce(
        (sectionIds, sectionData) =>
          sectionData.sectionValues.includes(request._id)
            ? [...sectionIds, sectionData.sectionId]
            : sectionIds,
        [],
      ),
  );
