import { useEffect, useMemo } from 'react';
import { isEqual, isEmpty } from 'lodash';
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
import { fetchActivitiesForForm } from 'Redux/Activities/activities.actions';

// SELECTORS
import { makeSelectForm } from 'Redux/Forms/forms.selectors';
import { selectActivitiesForForm } from 'Redux/Activities/activities.selectors';
import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import { getExtIdPropsPayload } from 'Redux/Integration/integration.selectors';
import { selectExtIds } from 'Redux/TE/te.selectors';

export const useActivitiesWatcher = ({ formId, filters, sorters, origin }) => {
  const teCoreAPI = useTECoreAPI();
  const selectForm = useMemo(() => makeSelectForm(), []);
  const form = useSelector((state) => selectForm(state, formId));
  const selectSubmissions = useMemo(() => makeSelectSubmissions(), []);
  const submissions = useSelector((state) => selectSubmissions(state, formId));
  const extIds = useSelector(selectExtIds);

  const activities = useSelector(
    selectActivitiesForForm({ formId: form._id, tableType: origin }),
  );
  const dispatch = useDispatch();
  const prevFilters = usePrevious(filters);
  useEffect(() => {
    if (!isEqual(prevFilters, filters)) {
      console.log('DO FETCHING');
      dispatch(fetchActivitiesForForm(formId, filters, sorters, origin));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevFilters, filters, origin]);

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
  }, [form.sections, form.objectScope, submissions, activities.length]);
  useFetchLabelsFromExtIds(submissionPayload);

  useEffect(() => {
    const activityPayload = getExtIdsFromActivities(activities);
    fetchLabelsFromExtIds(teCoreAPI, dispatch, extIds, activityPayload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities.length]);
};
