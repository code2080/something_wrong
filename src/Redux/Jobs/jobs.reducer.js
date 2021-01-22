import * as types from './jobs.actionTypes';
import { Job } from '../../Models/Job.model';
import _ from 'lodash';

// INITIAL STATE
import initialState from './jobs.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_ALL_JOBS_SUCCESS: {
      const { results = [] } = action.payload;
      return results.reduce(
        (tot, curr) => ({
          ...tot,
          [curr.formId]: {
            ..._.get(tot, `${curr.formId}`, {}),
            [curr._id]: curr,
          }
        }), {});
    }

    case types.CREATE_JOB_FAILURE: {
      return state;
    }

    case types.CREATE_JOB_SUCCESS: {
      try {
        const { payload: { actionMeta: _, ...jobObj } } = action;
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

    case types.ABORT_JOB_SUCCESS: {
      try {
        const { payload: { actionMeta: _, ...jobObj } } = action;
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
}

export default reducer;
