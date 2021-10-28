import _ from 'lodash';
import { Job } from '../../Models/Job.model';
import * as types from './jobs.actionTypes';

// INITIAL STATE
import initialState from './jobs.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_JOB_FAILURE: {
      return state;
    }

    case types.CREATE_JOB_SUCCESS: {
      try {
        const {
          payload: { actionMeta: _, ...jobObj },
        } = action;
        const job = new Job(jobObj);
        const formJobs = state[job.formId] || {};
        return {
          ...state,
          [job.formId]: {
            ...formJobs,
            [job._id]: job,
          },
        };
      } catch (error) {
        console.log(error);
        return state;
      }
    }

    case types.UPDATE_JOB_SUCCESS: {
      const {
        payload: { job: jobObj },
      } = action;
      const job = new Job(jobObj);
      const formJobs = state[job.formId] || {};
      return {
        ...state,
        [job.formId]: {
          ...formJobs,
          [job._id]: job,
        },
      };
    }

    case types.ABORT_JOB_SUCCESS: {
      try {
        const {
          payload: { job: jobObj },
        } = action;
        const job = new Job(jobObj);
        return {
          ...state,
          [job.formId]: {
            ...state[job.formId],
            [job._id]: job,
          },
        };
      } catch (error) {
        return state;
      }
    }

    default:
      return state;
  }
};

export default reducer;
