import _ from 'lodash';
import * as types from './filters.actionTypes';
import { EActivityFilterType } from '../../Types/ActivityFilter.interface';

// eslint-disable-next-line no-undef
const loadFiltersFromLS = (filterId: string) => {
  const stringedFilter = localStorage.getItem(filterId);
  if (stringedFilter)
    return JSON.parse(stringedFilter);
  return {};
};
// eslint-disable-next-line no-undef
const saveFilterToLS = (filterId: string, filter: any) => localStorage.setItem(filterId, JSON.stringify(filter));

const reducer = (state = {}, action) => {
  switch (action.type) {
    case types.SET_ACTIVITY_FILTER_INCLUSION: {
      const { filterId, inclusion } = action.payload;
      console.log(action);
      return {
        ...state,
        [`${filterId}_ACTIVITIES_SETTINGS`]: {
          ...(state[`${filterId}_ACTIVITIES_SETTINGS`] || {}),
          inclusion,
        },
      };
    }

    case types.SET_ACTIVITY_FILTER_MODE: {
      const { filterId, mode } = action.payload;
      return {
        ...state,
        [`${filterId}_ACTIVITIES_SETTINGS`]: {
          ...(state[`${filterId}_ACTIVITIES_SETTINGS`] || {}),
          mode,
        },
      };
    }

    case types.SET_ACTIVITY_FILTER_OPTIONS: {
      const { filterId, optionType, optionPayload, activityId } = action.payload;
      const filterIdOptionsState = _.get(state, `${filterId}_OPTIONS`, {});
      const filterIdMatchesState = _.get(state, `${filterId}_MATCHES`, {});
      const { extId, values } = optionPayload;
      switch (optionType) {
        case EActivityFilterType.FIELD:
        case EActivityFilterType.OBJECT:
        case EActivityFilterType.TIMING:
          return {
            ...state,
            [`${filterId}_OPTIONS`]: {
              ...filterIdOptionsState,
              [extId]: _.uniqBy([...(filterIdOptionsState && filterIdOptionsState[extId] ? filterIdOptionsState[extId] : []), ...values], 'value'),
            },
            [`${filterId}_MATCHES`]: {
              ...filterIdMatchesState,
              ...values.reduce((tot, acc) => {
                return {
                  ...tot,
                  [acc.value]: [
                    ...(filterIdMatchesState[acc.value] || []),
                    activityId,
                  ],
                };
              }, {}),
            },
          };
        case EActivityFilterType.OBJECT_FILTER: {
          return {
            ...state,
            [`${filterId}_OPTIONS`]: {
              ...filterIdOptionsState,
              [extId]: Object.keys(values).reduce((tot, fieldExtId) => {
                return {
                  ...tot,
                  [fieldExtId]: _.uniqBy([...(tot[fieldExtId] || []), ...values[fieldExtId]], 'value'),
                };
              }, filterIdOptionsState[extId] || {}),
            },
            [`${filterId}_MATCHES`]: {
              ...filterIdMatchesState,
              ...Object.keys(values).reduce((tot, fieldExtId) => {
                return {
                  ...tot,
                  ...values[fieldExtId].reduce((t, val) => {
                    return {
                      ...t,
                      [val.value]: [
                        ...(filterIdMatchesState[val.value] || []),
                        activityId,
                      ],
                    };
                  }, {})
                };
              }, {}),
            },
          };
        }
        default:
          return state;
      };
    }

    case types.LOAD_FILTER: {
      const { filterId } = action.payload;
      const filter = loadFiltersFromLS(filterId);
      return {
        ...state,
        [filterId]: filter,
      };
    };

    case types.SET_FILTER: {
      if (!action || !action.payload || !action.payload.filterId) return state;
      const { filterId, filter } = action.payload;
      saveFilterToLS(filterId, filter);
      return {
        ...state,
        [filterId]: filter,
      };
    };

    case types.UPDATE_FILTER: {
      if (!action || !action.payload || !action.payload.filterId) return state;
      const { filterId, key, value } = action.payload;
      const updFilter = {
        ...(state[filterId] || {}),
        [key]: value,
      };
      saveFilterToLS(filterId, updFilter);
      return {
        ...state,
        [filterId]: {
          ...updFilter
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
