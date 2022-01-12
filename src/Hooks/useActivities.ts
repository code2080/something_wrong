import { useEffect, useMemo, useState } from 'react';
import { isEqual, isEmpty, uniqWith } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { initialState as initialPayload } from 'Redux/TE/te.helpers';

// HOOKS
import { getExtIdsFromActivities } from 'Utils/ActivityValues/helpers';
import { usePrevious } from './usePrevious';
import {
  useFetchLabelsFromExtIds,
  fetchLabelsFromExtIds,
  useTECoreAPI,
} from 'Hooks/TECoreApiHooks';

// ACTIONS
import {
  fetchActivitiesForForm,
  resetAllActivities,
} from 'Redux/Activities/activities.actions';

// SELECTORS
import { makeSelectForm } from 'Redux/Forms/forms.selectors';
import {
  selectActivitiesForForm,
  selectAllActivities,
} from 'Redux/Activities/activities.selectors';
import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import { getExtIdPropsPayload } from 'Redux/Integration/integration.selectors';
import { selectExtIds } from 'Redux/TE/te.selectors';

// TYPES
import { TActivity } from 'Types/Activity.type';
import { GetExtIdPropsPayload, TEObject } from 'Types/TECorePayloads.type';
import { IndexedObject } from 'Redux/ObjectRequests/ObjectRequests.types';

interface Props {
  formId: string;
  filters: IndexedObject;
  sorters?: null | IndexedObject;
  origin: string;
  trigger?: number;
  pagination: { currentPage: number; limit: number; totalPages: number };
}
export const useActivitiesWatcher = ({
  formId,
  filters,
  sorters,
  origin,
  trigger,
  pagination,
}: Props) => {
  const teCoreAPI = useTECoreAPI();
  const selectForm = useMemo(() => makeSelectForm(), []);
  const form = useSelector((state) => selectForm(state, formId));
  const selectSubmissions = useMemo(() => makeSelectSubmissions(), []);
  const submissions = useSelector((state) => selectSubmissions(state, formId));
  const extIds = useSelector(selectExtIds);
  const allActivities = useSelector(selectAllActivities());

  const [totalPages, setTotalPages] = useState(pagination?.totalPages);
  const [page, setPage] = useState(pagination?.currentPage || 1);
  const [limit, setLimit] = useState(pagination?.limit || 10);

  const activities = useSelector(
    selectActivitiesForForm({ formId: form._id, tableType: origin }),
  );
  const dispatch = useDispatch();
  const prevFilters = usePrevious(filters);
  const prevSorters = usePrevious(sorters);

  const setCurrentPaginationParams = (page: number, limit: number) => {
    setPage(page);
    setLimit(limit);
  };

  // Fetch activities list there is any change in filters or sorters
  const doFetchingActivities = async () => {
    const res = await dispatch(
      fetchActivitiesForForm(
        formId,
        {
          filters,
          sorters,
          pagination: { page, limit },
        },
        origin,
      ),
    );
    if (res) {
      setTotalPages(res.totalPage ?? 1);
    }
  };

  // Fetch activities when filters or sorters are changed.
  useEffect(() => {
    if (!isEqual(prevFilters, filters) || !isEqual(prevSorters, sorters)) {
      doFetchingActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevFilters, prevSorters, filters, sorters, origin]);

  // Force fetching activities
  useEffect(() => {
    if (trigger) {
      doFetchingActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // Fetch when changing page
  useEffect(() => {
    if (page && page <= totalPages) {
      doFetchingActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const submissionPayload = useMemo(() => {
    const sections = form.sections;
    const submissionValues = submissions.map((submission) => submission.values);
    const teValues = isEmpty(submissionValues)
      ? initialPayload
      : getExtIdPropsPayload({
          sections,
          submissionValues,
          objectScope: form.objectScope,
          activities: Object.values(activities).flat(),
        });
    const scopedObjectExtids = submissions.map((s) => s.scopedObject);

    return {
      ...teValues,
      objects: [...teValues.objects, ...scopedObjectExtids],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.sections, form.objectScope, submissions, activities.length]);
  useFetchLabelsFromExtIds(submissionPayload);

  useEffect(() => {
    const activityPayload = getExtIdsFromActivities(activities);
    fetchLabelsFromExtIds(teCoreAPI, dispatch, extIds, activityPayload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities.length]);

  const getAllActivityIds = async () => {
    if (allActivities)
      return (allActivities as IndexedObject[]).map(({ _id }) => _id);
    const res = await dispatch(
      fetchActivitiesForForm(
        formId,
        {
          filters,
          sorters,
          pagination: {},
          getAll: true,
        },
        origin,
      ),
    );
    return res?.activities.map(({ _id }) => _id);
  };

  useEffect(() => {
    console.log('origin changed =>>>>', origin);
    dispatch(resetAllActivities());
  }, [origin, formId]);

  return {
    setCurrentPaginationParams,
    getAllActivityIds,
  };
};

export const useActivitiesObjectWatcher = ({
  activities = [],
}: {
  activities: TActivity[];
}) => {
  const teCoreObjectPayload: GetExtIdPropsPayload = useMemo(() => {
    const primaryObjects = activities
      .filter((activity: TActivity) => activity.scopedObject)
      .map(({ scopedObject }) => scopedObject || '');

    const jointTeachingObjects = activities
      .filter((activity: TActivity) => activity.jointTeaching?.object)
      .map(
        ({ jointTeaching }) =>
          ({
            type: jointTeaching?.typeExtId,
            id: jointTeaching?.object,
          } as TEObject),
      );
    return {
      objects: uniqWith([...primaryObjects, ...jointTeachingObjects], isEqual),
      fields: [],
      types: [],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities.length]);

  useFetchLabelsFromExtIds(teCoreObjectPayload);
};
