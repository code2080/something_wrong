import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { Tabs } from 'antd';

// COMPONENTS
import TEAntdTabBar from '../../Components/TEAntdTabBar';
import JobToolbar from '../../Components/JobToolbar/JobToolbar';

// HOOKS
import {
  useFetchLabelsFromExtIds,
  fetchLabelsFromExtIds,
  useTECoreAPI,
} from '../../Hooks/TECoreApiHooks';

// ACTIONS
import { fetchFormSubmissions } from '../../Redux/FormSubmissions/formSubmissions.actions';
import { fetchMappings } from '../../Redux/ActivityDesigner/activityDesigner.actions';
import {
  setBreadcrumbs,
  setFormDetailTab,
} from '../../Redux/GlobalUI/globalUI.actions';
import { fetchActivitiesForForm } from '../../Redux/Activities/activities.actions';
import { fetchActivityTagsForForm } from '../../Redux/ActivityTag/activityTag.actions';
import { loadFilter } from '../../Redux/Filters/filters.actions';
import { fetchConstraints } from '../../Redux/Constraints/constraints.actions';
import { fetchConstraintConfigurations } from '../../Redux/ConstraintConfigurations/constraintConfigurations.actions';

// SELECTORS
import { getExtIdPropsPayload } from '../../Redux/Integration/integration.selectors';
import { makeSelectForm } from '../../Redux/Forms/forms.selectors';
import {
  makeSelectSortParamsForActivities,
  selectFormDetailTab,
} from '../../Redux/GlobalUI/globalUI.selectors';
import { hasPermission } from '../../Redux/Auth/auth.selectors';

// PAGES
import SubmissionsPage from './pages/submissions.page';
import FormInfoPage from './pages/formInfo.page';
import ActivitiesPage from './pages/activities.page';
import ActivityDesignPage from './pages/activityDesigner.page';
import ConstraintManagerPage from './pages/constraintManager.page';
import ObjectRequestsPage from './pages/objectRequests.page';

// CONSTANTS
import { initialState as initialPayload } from '../../Redux/TE/te.helpers';
import { teCoreCallnames } from '../../Constants/teCoreActions.constants';
import { selectFormObjectRequest } from '../../Redux/ObjectRequests/ObjectRequestsNew.selectors';

import {
  ASSISTED_SCHEDULING_PERMISSION_NAME,
  AE_ACTIVITY_PERMISSION,
} from '../../Constants/permissions.constants';
import { makeSelectActivitiesForForm } from '../../Redux/Activities/activities.selectors';
import { getExtIdsFromActivities } from '../../Utils/ActivityValues/helpers';
import { selectExtIds } from '../../Redux/TE/te.selectors';
import { makeSelectSubmissions } from '../../Redux/FormSubmissions/formSubmissions.selectors';
import { makeSelectSelectedFilterValues } from '../../Redux/Filters/filters.selectors';

export const TAB_CONSTANT = {
  FORM_INFO: 'FORM_INFO',
  SUBMISSIONS: 'SUBMISSIONS',
  OBJECT_REQUESTS: 'OBJECT_REQUESTS',
  ACTIVITIES: 'ACTIVITIES',
  ACTIVITY_DESIGNER: 'ACTIVITY_DESIGNER',
  CONSTRAINT_MANAGER: 'CONSTRAINT_MANAGER',
};

const FormPage = () => {
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();
  const { formId } = useParams();

  /**
   * SELECTORS
   */
  const selectForm = useMemo(() => makeSelectForm(), []);
  const form = useSelector((state) => selectForm(state, formId));
  const selectSubmissions = useMemo(() => makeSelectSubmissions(), []);
  const submissions = useSelector((state) => selectSubmissions(state, formId));
  const selectedFormDetailTab = useSelector(selectFormDetailTab);
  const hasActivityDesignPermission = useSelector(
    hasPermission(AE_ACTIVITY_PERMISSION),
  );
  const hasAssistedSchedulingPermission = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );
  const reqs = useSelector(selectFormObjectRequest(formId));
  const formHasObjReqs = !_.isEmpty(reqs);

  // Select filters
  const selectSelectedFilterValues = useMemo(
    () => makeSelectSelectedFilterValues(),
    [],
  );
  const selectedFilterValues = useSelector((state) =>
    selectSelectedFilterValues(state, formId),
  );

  // Select sorting
  const selectActivityParamSorting = useMemo(
    () => makeSelectSortParamsForActivities(),
    [],
  );

  const selectedSortingParams = useSelector((state) =>
    selectActivityParamSorting(state, formId),
  );

  useEffect(
    () =>
      dispatch(
        fetchActivitiesForForm(
          formId,
          selectedFilterValues,
          selectedSortingParams,
        ),
      ),
    [dispatch, formId, selectedFilterValues, selectedSortingParams],
  );

  useEffect(() => {
    dispatch(fetchFormSubmissions(formId));
    dispatch(fetchMappings(formId));
    dispatch(fetchActivityTagsForForm(formId));
    dispatch(fetchConstraints());
    dispatch(fetchConstraintConfigurations(formId));
    dispatch(
      setBreadcrumbs([
        { path: '/forms', label: 'Forms' },
        { path: `/forms/${formId}`, label: form.name },
      ]),
    );
    dispatch(loadFilter({ filterId: `${formId}_SUBMISSIONS` }));
    dispatch(loadFilter({ filterId: `${formId}_ACTIVITIES` }));
    teCoreAPI[teCoreCallnames.SET_FORM_TYPE]({ formType: form.formType });
    form.reservationmode &&
      teCoreAPI[teCoreCallnames.SET_RESERVATION_MODE]({
        mode: form.reservationmode,
        callback: ({ _res }) => {},
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, form]);
  // **** Test sending objects with type to core to see if this helps with DEV-7663
  const selectActivitiesForForm = useMemo(
    () => makeSelectActivitiesForForm(),
    [],
  );
  const activities = useSelector((state) =>
    selectActivitiesForForm(state, formId),
  );
  const submissionPayload = useMemo(() => {
    const sections = form.sections;
    const submissionValues = submissions.map((submission) => submission.values);
    const teValues = _.isEmpty(submissionValues)
      ? initialPayload
      : getExtIdPropsPayload({
          sections,
          submissionValues,
          objectScope: form.objectScope,
          activities,
        });
    const scopedObjectExtids = submissions.map((s) => s.scopedObject);

    return {
      ...teValues,
      objects: [...teValues.objects, ...scopedObjectExtids],
    };
  }, [form.sections, form.objectScope, submissions, activities]);

  const extIds = useSelector(selectExtIds);

  useEffect(() => {
    const activityPayload = getExtIdsFromActivities(activities);
    console.log({ extIds: activityPayload });
    fetchLabelsFromExtIds(teCoreAPI, dispatch, extIds, activityPayload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities]);
  // ****

  // Effect to get all TE values into redux state
  useFetchLabelsFromExtIds(submissionPayload);

  /**
   * EVENT HANDLERS
   */
  const onChangeTabKey = (key) => {
    dispatch(setFormDetailTab(key));
  };

  return (
    <div className='form--wrapper'>
      <JobToolbar />
      <TEAntdTabBar activeKey={selectedFormDetailTab} onChange={onChangeTabKey}>
        <Tabs.TabPane tab='FORM INFO' key={TAB_CONSTANT.FORM_INFO}>
          <FormInfoPage />
        </Tabs.TabPane>
        <Tabs.TabPane tab='SUBMISSIONS' key={TAB_CONSTANT.SUBMISSIONS}>
          <SubmissionsPage />
        </Tabs.TabPane>
        {formHasObjReqs && (
          <Tabs.TabPane
            tab='OBJECT REQUESTS'
            key={TAB_CONSTANT.OBJECT_REQUESTS}
          >
            <ObjectRequestsPage />
          </Tabs.TabPane>
        )}
        <Tabs.TabPane
          tab='ACTIVITIES'
          key={TAB_CONSTANT.ACTIVITIES}
          forceRender
        >
          <ActivitiesPage />
        </Tabs.TabPane>
        {hasActivityDesignPermission && (
          <Tabs.TabPane
            tab='ACTIVITY DESIGNER'
            key={TAB_CONSTANT.ACTIVITY_DESIGNER}
          >
            {selectedFormDetailTab === TAB_CONSTANT.ACTIVITY_DESIGNER && (
              <ActivityDesignPage />
            )}
          </Tabs.TabPane>
        )}
        {hasAssistedSchedulingPermission && hasActivityDesignPermission && (
          <Tabs.TabPane
            tab='CONSTRAINT MANAGER'
            key={TAB_CONSTANT.CONSTRAINT_MANAGER}
          >
            <ConstraintManagerPage />
          </Tabs.TabPane>
        )}
      </TEAntdTabBar>
    </div>
  );
};

export default FormPage;
