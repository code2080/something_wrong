import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import * as types from './jointTeaching.actionTypes';

const getBaseEndpoint = (formId: string) =>
  `${getEnvParams().AM_BE_URL}forms/${formId}/joint-teaching`;

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
