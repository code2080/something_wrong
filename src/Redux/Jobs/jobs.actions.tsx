import { TActivity } from 'Types/Activity.type';
import noop from 'lodash/noop';
import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import { ActivityValueValidation } from 'Types/ActivityValueValidation.type';
import { populateWithFieldConstraint } from '../../Utils/activities.helpers';
import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import { Job } from '../../Models/Job.model';
import { schedulingAlgorithms } from '../../Constants/schedulingAlgorithms.constants';
import { SchedulingReturn } from '../../Models/SchedulingReturn.model';
import { schedulingModes } from '../../Constants/schedulingModes.constants';
import { selectSelectedConstraintConfiguration } from '../ConstraintConfigurations/constraintConfigurations.selectors';
import { EActivityStatus } from '../../Types/ActivityStatus.enum';
import * as types from './jobs.actionTypes';

export const updateJobFromWS = (job) => ({
  type: types.UPDATE_JOB_SUCCESS,
  payload: { job },
});

const createJobFlow = {
  request: (params, postAction) => {
    const { callback, activities } = postAction;
    callback(
      activities.map((a) => ({
        activityId: a._id,
        result: new SchedulingReturn({
          status: EActivityStatus.QUEUED,
        }),
      })),
    );
    return { type: types.CREATE_JOB_REQUEST, payload: activities };
  },
  success: (response, _params, _postAction) => ({
    type: types.CREATE_JOB_SUCCESS,
    payload: { ...response },
  }),
  failure: (err, params, postAction) => {
    const { callback, meta, activities } = postAction;
    if (meta.schedulingMode === schedulingModes.SINGLE) {
      callback(
        new SchedulingReturn({
          status: EActivityStatus.FAILED,
          errorCode: err.code || -1,
          errorMessage: err.message || 'Failed to create job',
        }),
      );
    } else {
      callback(
        activities.map((a) => ({
          activityId: a._id,
          result: new SchedulingReturn({
            status: EActivityStatus.FAILED,
            errorCode: err.code || -1,
            errorMessage: err.message || 'Failed to create job',
          }),
        })),
      );
    }
    return { type: types.CREATE_JOB_FAILURE, payload: { ...err } };
  },
};

export const createJob =
  ({
    activities = [],
    type = schedulingAlgorithms.UNKNOWN,
    formId,
    formInstanceIds = [],
    callback = noop,
    meta = {},
  }: {
    activities: TActivity[];
    type: string;
    formId: string;
    formInstanceIds: string[];
    callback(result: ActivityValueValidation[]): void;
    meta: any;
  }) =>
  async (dispatch, getState) => {
    const storeState = await getState();
    const {
      auth: { coreUserId },
    } = storeState;
    const currentConstraintConfiguration =
      selectSelectedConstraintConfiguration(storeState, formId);

    const submissions = makeSelectSubmissions()(storeState, formId);
    const activitiesWithParameterData = populateWithFieldConstraint({
      activities,
      constraintConfiguration: currentConstraintConfiguration,
      submissions,
    });
    const job = new Job({
      activities: activitiesWithParameterData,
      type,
      formId,
      formInstanceIds,
      constraintConfigurationId: currentConstraintConfiguration?._id || null,
      userId: coreUserId,
    });
    dispatch(
      asyncAction.POST({
        flow: createJobFlow,
        endpoint: `${getEnvParams().AM_BE_URL}jobs`,
        params: job,
        postAction: { callback, meta, activities },
      }),
    );
  };

const abortJobFlow = {
  request: () => ({ type: types.ABORT_JOB_REQUEST }),
  success: (response) => ({
    type: types.ABORT_JOB_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({ type: types.ABORT_JOB_FAILURE, payload: { ...err } }),
};

export const abortJob =
  ({ jobId, formId }) =>
  async (dispatch) =>
    dispatch(
      asyncAction.POST({
        flow: abortJobFlow,
        endpoint: `${getEnvParams().AM_BE_URL}jobs/${jobId}/stop`,
        params: { formId },
      }),
    );
