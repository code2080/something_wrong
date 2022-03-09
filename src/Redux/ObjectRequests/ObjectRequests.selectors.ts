import { createSelector } from 'reselect';
import _, { flatten } from 'lodash';

import { getSubmissionValues } from '../../Redux/FormSubmissions/formSubmissions.helpers';
import { selectFormInstance } from '../../Redux/FormSubmissions/formSubmissions.selectors';

const selectObjectRequestsState = (state) => state.objectRequests;
const getObjectRequestByValue = (objReqList, value) =>
  objReqList.find((req) => req._id === value || req.objectExtId === value);

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

export const getSectionsForObjectRequest = (request, formId) =>
  createSelector(
    (state) =>
      getSubmissionValues(
        selectFormInstance(formId, request.formInstanceId)(state),
      ),
    (submissionValues) =>
      submissionValues.reduce(
        (sectionIds, sectionData) =>
          flatten(sectionData.sectionValues).includes(request._id)
            ? [...sectionIds, sectionData.sectionId]
            : sectionIds,
        [],
      ),
  );
