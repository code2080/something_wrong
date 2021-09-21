import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import * as types from './jointTeaching.actionTypes';

const getBaseEndpoint = (formId: string) =>
  `${getEnvParams().AM_BE_URL}forms/${formId}/joint-teaching`;

const fetchJointTeachingGroupsForFormFlow = (formId: string) => ({
  request: () => ({ type: types.FETCH_JOINT_TEACHING_GROUPS_FOR_FORM_REQUEST }),
  success: (response) => ({
    type: types.FETCH_JOINT_TEACHING_GROUPS_FOR_FORM_SUCCESS,
    payload: { ...response, formId },
  }),
  failure: (err) => ({
    type: types.FETCH_JOINT_TEACHING_GROUPS_FOR_FORM_FAILURE,
    payload: { ...err },
  }),
});

export const fetchJointTeachingGroupsForForm = (payload) => {
  const { formId = '' } = payload;
  return asyncAction.GET({
    flow: fetchJointTeachingGroupsForFormFlow(formId),
    endpoint: `${getBaseEndpoint(formId)}`,
  });
};

const createJointTeachingGroupFlow = (formId: string) => ({
  request: () => ({ type: types.CREATE_JOINT_TEACHING_GROUP_REQUEST }),
  success: (response) => ({
    type: types.CREATE_JOINT_TEACHING_GROUP_SUCCESS,
    payload: { ...response, formId },
  }),
  failure: (err) => ({
    type: types.CREATE_JOINT_TEACHING_GROUP_FAILURE,
    payload: { ...err },
  }),
});

export const createJointTeachingGroup = ({ formId, activityIds }) => {
  return asyncAction.POST({
    flow: createJointTeachingGroupFlow(formId),
    endpoint: `${getBaseEndpoint(formId)}`,
    params: {
      activityIds,
    },
  });
};

const mergeJointTeachingGroupFlow = (formId: string) => ({
  request: () => ({ type: types.MERGE_JOINT_TEACHING_GROUP_REQUEST }),
  success: (response) => ({
    type: types.MERGE_JOINT_TEACHING_GROUP_SUCCESS,
    payload: { ...response, formId },
  }),
  failure: (err) => ({
    type: types.MERGE_JOINT_TEACHING_GROUP_FAILURE,
    payload: { ...err },
  }),
});
export const mergeJointTeachingGroup = ({ formId, jointTeachingId }) => {
  return asyncAction.POST({
    flow: mergeJointTeachingGroupFlow(formId),
    endpoint: `${getBaseEndpoint(formId)}/${jointTeachingId}/merge`,
  });
};

const revertJointTeachingGroupFlow = (formId: string) => ({
  request: () => ({ type: types.REVERT_JOINT_TEACHING_GROUP_REQUEST }),
  success: (response) => ({
    type: types.REVERT_JOINT_TEACHING_GROUP_SUCCESS,
    payload: { ...response, formId },
  }),
  failure: (err) => ({
    type: types.REVERT_JOINT_TEACHING_GROUP_FAILURE,
    payload: { ...err },
  }),
});
export const revertJointTeachingGroup = ({ formId, jointTeachingId }) => {
  return asyncAction.POST({
    flow: revertJointTeachingGroupFlow(formId),
    endpoint: `${getBaseEndpoint(formId)}/${jointTeachingId}/revert`,
  });
};

const deleteJointTeachingGroupFlow = (formId: string) => ({
  request: () => ({ type: types.DELETE_JOINT_TEACHING_GROUP_REQUEST }),
  success: (response) => ({
    type: types.DELETE_JOINT_TEACHING_GROUP_SUCCESS,
    payload: { ...response, formId },
  }),
  failure: (err) => ({
    type: types.DELETE_JOINT_TEACHING_GROUP_FAILURE,
    payload: { ...err },
  }),
});
export const deleteJointTeachingGroup = ({ formId, jointTeachingId }) => {
  return asyncAction.DELETE({
    flow: deleteJointTeachingGroupFlow(formId),
    endpoint: `${getBaseEndpoint(formId)}/${jointTeachingId}`,
  });
};

const addActivityToJointTeachingGroupFlow = (formId: string) => ({
  request: () => ({ type: types.ADD_ACTIVITY_TO_JOINT_TEACHING_GROUP_REQUEST }),
  success: (response) => ({
    type: types.ADD_ACTIVITY_TO_JOINT_TEACHING_GROUP_SUCCESS,
    payload: { ...response, formId },
  }),
  failure: (err) => ({
    type: types.ADD_ACTIVITY_TO_JOINT_TEACHING_GROUP_FAILURE,
    payload: { ...err },
  }),
});

export const addActivityToJointTeachingGroup = ({
  formId,
  jointTeachingId,
  activityIds,
}) => {
  return asyncAction.PUT({
    flow: addActivityToJointTeachingGroupFlow(formId),
    endpoint: `${getBaseEndpoint(formId)}/${jointTeachingId}/add`,
    params: {
      activityIds,
    },
  });
};

const deleteActivityFromJointTeachingGroupFlow = (formId: string) => ({
  request: () => ({
    type: types.DELETE_ACTIVITY_FROM_JOINT_TEACHING_GROUP_REQUEST,
  }),
  success: (response) => ({
    type: types.DELETE_ACTIVITY_FROM_JOINT_TEACHING_GROUP_SUCCESS,
    payload: { ...response, formId },
  }),
  failure: (err) => ({
    type: types.DELETE_ACTIVITY_FROM_JOINT_TEACHING_GROUP_FAILURE,
    payload: { ...err },
  }),
});

export const deleteActivityFromJointTeachingGroup = ({
  formId,
  jointTeachingId,
  activityIds,
}) => {
  return asyncAction.PUT({
    flow: deleteActivityFromJointTeachingGroupFlow(formId),
    endpoint: `${getBaseEndpoint(formId)}/${jointTeachingId}/remove`,
    params: {
      activityIds,
    },
  });
};

const generateJointTeachingGroupFlow = (formId: string) => ({
  request: () => ({
    type: types.GENERATE_JOINT_TEACHING_GROUP_REQUEST,
  }),
  success: (response) => ({
    type: types.GENERATE_JOINT_TEACHING_GROUP_SUCCESS,
    payload: { ...response, formId },
  }),
  failure: (err) => ({
    type: types.GENERATE_JOINT_TEACHING_GROUP_FAILURE,
    payload: { ...err },
  }),
});

export const generateJointTeachingGroup = ({ formId }) => {
  return asyncAction.POST({
    flow: generateJointTeachingGroupFlow(formId),
    endpoint: `${getBaseEndpoint(formId)}/auto-generate`,
  });
};
