import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { Tabs } from 'antd';

// COMPONENTS
import TEAntdTabBar from '../../Components/TEAntdTabBar';
import JobToolbar from '../../Components/JobToolbar/JobToolbar';
import FormInfoModal from '../../Components/Modals/FormInfoModal';

// HOOKS
import {
  useFetchLabelsFromExtIds,
  useTECoreAPI,
} from '../../Hooks/TECoreApiHooks';

// ACTIONS
import { fetchMappings } from '../../Redux/ActivityDesigner/activityDesigner.actions';
import {
  resetActivitiesFetchingHandler,
  selectActivitiesInTable,
  setBreadcrumbs,
  setFormDetailTab,
} from '../../Redux/GlobalUI/globalUI.actions';
import { fetchTagsForForm } from '../../Redux/Tags';
import { fetchConstraints } from '../../Redux/Constraints/constraints.actions';
import { fetchConstraintConfigurations } from '../../Redux/ConstraintConfigurations/constraintConfigurations.actions';

// SELECTORS
import { makeSelectForm } from '../../Redux/Forms/forms.selectors';
import { selectFormDetailTab } from '../../Redux/GlobalUI/globalUI.selectors';
import {
  hasPermission,
  selectIsBetaOrDev,
} from '../../Redux/Auth/auth.selectors';

// CONSTANTS
import { teCoreCallnames } from '../../Constants/teCoreActions.constants';
import { selectFormObjectRequest } from '../../Redux/ObjectRequests/ObjectRequestsNew.selectors';
import {
  ACTIVITIES_TABLE,
  UNMATCHED_ACTIVITIES_TABLE,
  MATCHED_ACTIVITIES_TABLE,
} from '../../Constants/tables.constants';

import {
  ASSISTED_SCHEDULING_PERMISSION_NAME,
  AE_ACTIVITY_PERMISSION,
} from '../../Constants/permissions.constants';

// PAGES
import ObjectRequestsPage from './pages/objectRequests.page';
import ConstraintManagerPage from './pages/constraintManager.page';
import ActivityDesignPage from './pages/activityDesigner.page';
import ActivitiesPage from './pages/Activities/activities.page';
import SubmissionsPage from './pages/submissions.page';
import JointTeachingPage from './pages/JointTeaching/jointTeaching.page';
import GroupManagementPage from './pages/groupManagement.page';
import { getExtIdPropsPayload } from '../../Redux/Integration/integration.selectors';
import { makeSelectSubmissions } from '../../Redux/FormSubmissions/formSubmissions.selectors';
import FormDetailBreadcrumb from 'Components/FormDetailBreadcrumb';
import SSPResourceWrapper from 'Components/SSP/Components/Wrapper';
import { selectSSPState } from 'Components/SSP/Utils/selectors';
import {
  initializeSSPStateProps,
  fetchActivityFilterLookupMapForForm,
  fetchActivitiesForForm,
  clearActivityFilters,
} from 'Redux/Activities';
import { ISSPQueryObject } from 'Types/SSP.type';
import { fetchActivityInWorkerProgress } from 'Redux/DEPR_Activities/activities.actions';

export const TAB_CONSTANT = {
  FORM_INFO: 'FORM_INFO',
  SUBMISSIONS: 'SUBMISSIONS',
  OBJECT_REQUESTS: 'OBJECT_REQUESTS',
  ACTIVITIES: 'ACTIVITIES',
  ACTIVITY_DESIGNER: 'ACTIVITY_DESIGNER',
  CONSTRAINT_MANAGER: 'CONSTRAINT_MANAGER',
  JOINT_TEACHING: 'JOINT_TEACHING',
  GROUP_MANAGEMENT: 'GROUP_MANAGEMENT',
};

const FormPage = () => {
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();
  const { formId } = useParams<{ formId: string }>();

  /**
   * SELECTORS
   */
  const selectForm = useMemo(() => makeSelectForm(), []);
  const form = useSelector((state) => selectForm(state, formId));
  const selectFormSubmissions = useMemo(() => makeSelectSubmissions(), []);
  const submissions = useSelector((state) =>
    selectFormSubmissions(state, formId),
  );
  const selectedFormDetailTab = useSelector(selectFormDetailTab);
  const hasActivityDesignPermission = useSelector(
    hasPermission(AE_ACTIVITY_PERMISSION),
  );
  const hasAssistedSchedulingPermission = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );
  const reqs = useSelector(selectFormObjectRequest(formId));
  const formHasObjReqs = !_.isEmpty(reqs);
  const isBeta = useSelector(selectIsBetaOrDev);

  /**
   * STATE
   */
  const [showFormInfoModal, setShowFormInfoModal] = useState(false);

  /**
   * EFFECTS
   */
  useEffect(() => {
    dispatch(fetchMappings(form));
    dispatch(fetchTagsForForm(formId));
    dispatch(fetchConstraints());
    dispatch(fetchConstraintConfigurations(formId));
    dispatch(fetchActivityInWorkerProgress(formId));
    dispatch(
      setBreadcrumbs([
        { path: '/forms', label: 'Forms' },
        {
          path: `/forms/${formId}`,
          label: (
            <FormDetailBreadcrumb
              formName={form.name || 'Unknown form'}
              onToggleModalState={() => setShowFormInfoModal(true)}
            />
          ),
        },
      ]),
    );

    teCoreAPI[teCoreCallnames.SET_FORM_TYPE]({ formType: form.formType });
    form.reservationmode &&
      teCoreAPI[teCoreCallnames.SET_RESERVATION_MODE]({
        mode: form.reservationmode,
        callback: ({ _res }) => {},
      });
    [
      ACTIVITIES_TABLE,
      UNMATCHED_ACTIVITIES_TABLE,
      MATCHED_ACTIVITIES_TABLE,
    ].forEach((tableType) => {
      dispatch(selectActivitiesInTable(tableType));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, form]);

  // Reset all form related state
  useEffect(() => {
    return () => {
      console.log('im running');
      dispatch(resetActivitiesFetchingHandler());
      dispatch(clearActivityFilters());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submissionPayload = useMemo(() => {
    const initialPayload = { objects: [], types: [], fields: [] };
    const sections = form.sections;
    const submissionValues = submissions.map((submission) => submission.values);
    const teValues = _.isEmpty(submissionValues)
      ? initialPayload
      : getExtIdPropsPayload({
          sections,
          submissionValues,
          objectScope: form.objectScope,
          activities: [],
        });
    const scopedObjectExtids = submissions.map((s) => s.scopedObject);

    return {
      ...teValues,
      objects: [...teValues.objects, ...scopedObjectExtids],
    };
  }, [form.sections, form.objectScope, submissions]);

  // Effect to get all TE values into redux state
  useFetchLabelsFromExtIds(submissionPayload);

  /**
   * EVENT HANDLERS
   */
  const onChangeTabKey = (key: string) => {
    dispatch(setFormDetailTab(key));
  };

  return (
    <SSPResourceWrapper
      name={`${formId}__FORM_DETAIL`}
      selectorFn={selectSSPState('activities')}
      fetchFn={(partialQuery?: Partial<ISSPQueryObject>) =>
        fetchActivitiesForForm(formId, partialQuery)
      }
      initSSPStateFn={(partialQuery?: Partial<ISSPQueryObject>) =>
        initializeSSPStateProps(partialQuery)
      }
      fetchFilterLookupsFn={() => fetchActivityFilterLookupMapForForm(formId)}
    >
      <div className='form--wrapper'>
        <JobToolbar />
        <TEAntdTabBar
          activeKey={selectedFormDetailTab}
          onChange={onChangeTabKey}
        >
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
          <Tabs.TabPane tab='JOINT TEACHING' key={TAB_CONSTANT.JOINT_TEACHING}>
            {selectedFormDetailTab === TAB_CONSTANT.JOINT_TEACHING && (
              <JointTeachingPage />
            )}
          </Tabs.TabPane>
          {isBeta && (
            <Tabs.TabPane
              tab='GROUP MANAGEMENT'
              key={TAB_CONSTANT.GROUP_MANAGEMENT}
            >
              {selectedFormDetailTab === TAB_CONSTANT.GROUP_MANAGEMENT && (
                <GroupManagementPage />
              )}
            </Tabs.TabPane>
          )}
          <Tabs.TabPane
            tab='ACTIVITIES'
            key={TAB_CONSTANT.ACTIVITIES}
            forceRender
          >
            {selectedFormDetailTab === TAB_CONSTANT.ACTIVITIES && (
              <ActivitiesPage />
            )}
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
        <FormInfoModal
          isVisible={showFormInfoModal}
          formId={formId}
          onHide={() => setShowFormInfoModal(false)}
        />
      </div>
    </SSPResourceWrapper>
  );
};

export default FormPage;
