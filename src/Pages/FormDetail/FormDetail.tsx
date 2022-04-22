import { useContext, useEffect, useMemo, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { Tabs } from 'antd';

// COMPONENTS
import TEAntdTabBar from '../../Components/TEAntdTabBar';
import JobToolbar from '../../Components/Toolbars/Job';
import FormInfoModal from '../../Components/Modals/FormInfoModal';
import FormDetailBreadcrumb from 'Components/FormDetailBreadcrumb';
import SSPResourceWrapper from 'Components/SSP/Components/Wrapper';

// HOOKS
import {
  useFetchLabelsFromExtIds,
  useTECoreAPI,
} from '../../Hooks/TECoreApiHooks';

// REDUX
import { fetchMappings } from '../../Redux/ActivityDesigner/activityDesigner.actions';
import {
  setBreadcrumbs,
  setFormDetailTab,
} from '../../Redux/GlobalUI/globalUI.actions';
import { fetchTagsForForm } from '../../Redux/Tags';
import { fetchConstraints } from 'Redux/Constraints';
import {
  selectFormDetailSubmission,
  selectFormDetailTab,
} from '../../Redux/GlobalUI/globalUI.selectors';
import { hasPermission } from '../../Redux/Auth/auth.selectors';
import { getExtIdPropsPayload } from '../../Redux/Integration/integration.selectors';
import { makeSelectSubmissions } from '../../Redux/FormSubmissions/formSubmissions.selectors';
import {
  fetchActivityFilterLookupMapForForm,
  fetchActivitiesForForm,
  resetState,
  selectActivitiesWorkerStatus,
  updateWorkerStatus,
  filterLookupMapLoading,
  initializeSSPStateProps,
} from 'Redux/Activities';
import { formSelector } from 'Redux/Forms';
import { activitiesSelector } from '../../Redux/Activities';
import { selectSSPState } from 'Components/SSP/Utils/selectors';
import {
  fetchJobsForForm,
  updateWorkerStatus as updateJobWorkerStatus,
} from 'Redux/Jobs';
import { fetchConstraintProfilesForForm } from 'Redux/ConstraintProfiles';

// CONSTANTS
import { teCoreCallnames } from '../../Constants/teCoreActions.constants';
import { selectFormObjectRequest } from '../../Redux/ObjectRequests/ObjectRequestsNew.selectors';
import {
  ASSISTED_SCHEDULING_PERMISSION_NAME,
  AE_ACTIVITY_PERMISSION,
} from '../../Constants/permissions.constants';

// PAGES
import ObjectRequestsPage from './pages/objectRequests.page';
import ConstraintProfilesPage from './pages/ConstraintProfiles';
import ActivityDesignPage from './pages/Designer';
import ActivitiesPage from './pages/Activities/activities.page';
import SubmissionOverviewPage from './pages/SubmissionOverview';
import SubmissionsDetailPage from './pages/SubmissionDetail';
import JointTeachingPage from './pages/JointTeaching/jointTeaching.page';
import GroupManagementPage from './pages/GroupManagement';
import JobsPage from './pages/Jobs/jobs.page';

// TYPES
import { IDefaultSocketPayload } from 'Types/WebSocket.type';
import { ISSPQueryObject } from 'Types/SSP.type';
import { fetchGroupsForForm } from 'Redux/Groups';
import { EFormDetailTabs } from 'Types/FormDetailTabs.enum';
import { SocketContext } from 'Services/websocket.service';

export const TAB_CONSTANT = {
  FORM_INFO: 'FORM_INFO',
  SUBMISSIONS: 'SUBMISSIONS',
  OBJECT_REQUESTS: 'OBJECT_REQUESTS',
  ACTIVITIES: 'ACTIVITIES',
  ACTIVITY_DESIGNER: 'ACTIVITY_DESIGNER',
  CONSTRAINT_PROFILES: 'CONSTRAINT_PROFILES',
  JOINT_TEACHING: 'JOINT_TEACHING',
  GROUP_MANAGEMENT: 'GROUP_MANAGEMENT',
  JOBS: 'JOBS',
};

const FormPage = () => {
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();
  const { formId } = useParams<{ formId: string }>();

  /**
   * CONTEXTS
   */
  const socketContext = useContext(SocketContext);

  /**
   * SELECTORS
   */
  const activitiesWorkerStatus = useSelector(selectActivitiesWorkerStatus);
  const isFilterLookupMapLoading = useSelector(filterLookupMapLoading);
  const form = useSelector(formSelector(formId));
  const selectFormSubmissions = useMemo(() => makeSelectSubmissions(), []);
  const submissions = useSelector((state) =>
    selectFormSubmissions(state, formId as string),
  );
  const selectedFormDetailTab = useSelector(selectFormDetailTab);
  const hasActivityDesignPermission = useSelector(
    hasPermission(AE_ACTIVITY_PERMISSION),
  );
  const hasAssistedSchedulingPermission = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );
  const reqs = useSelector(selectFormObjectRequest(formId as string));
  const formHasObjReqs = !_.isEmpty(reqs);
  const selectedSubmissionId = useSelector(selectFormDetailSubmission);

  /**
   * STATE
   */
  const [showFormInfoModal, setShowFormInfoModal] = useState(false);
  const paginatedActivites = useSelector(activitiesSelector);

  /**
   * Set up handlers and pass data for web socket subscriptions
   */
  const socketEventMap = {
    ACTIVITY_GENERATION_UPDATE: (payload: IDefaultSocketPayload) => {
      if (payload.data.status !== 'OK' || !formId) return;
      if (payload.data.workerStatus === 'IN_PROGRESS') {
        // Set the redux state to in progress
        dispatch(updateWorkerStatus('IN_PROGRESS'));
      }
      // Only fetch new activities if the REDUX state's workerStatus value is IN_PROGRESS
      if (
        payload.data.workerStatus === 'DONE' &&
        activitiesWorkerStatus === 'IN_PROGRESS'
      ) {
        dispatch(fetchActivitiesForForm(formId, {}));
      }
    },
    ACTIVITY_BATCH_OPERATION_UPDATE: (payload: IDefaultSocketPayload) => {
      if (payload.data.status !== 'OK' || !formId) return;
      dispatch(fetchActivitiesForForm(formId, {}));

      if (selectedFormDetailTab === EFormDetailTabs.GROUP_MANAGEMENT)
        dispatch(fetchGroupsForForm(formId, {}));
    },
    FILTER_LOOKUP_MAP_UPDATE: (payload: IDefaultSocketPayload) => {
      if (payload.data.status !== 'OK' || !formId) return;
      if (payload.data.workerStatus === 'DONE' && !isFilterLookupMapLoading) {
        dispatch(fetchActivityFilterLookupMapForForm(formId));
      }
    },
    JOB_UPDATE: (payload: IDefaultSocketPayload) => {
      if (payload.data.status !== 'OK' || !formId) return;
      batch(() => {
        dispatch(updateJobWorkerStatus(payload.data.workerStatus));
        dispatch(fetchJobsForForm(formId));
      });
    },
  };
  socketContext.setFormId(formId);
  socketContext.setEventMap(socketEventMap);

  useEffect(() => {
    if (!form || !formId) return;
    dispatch(fetchMappings(form));
    dispatch(fetchTagsForForm(formId));
    dispatch(fetchConstraints());
    dispatch(fetchConstraintProfilesForForm(formId));
    dispatch(
      setBreadcrumbs([
        { path: '/forms', label: 'Forms' },
        {
          path: `/forms/${formId}`,
          label: (
            <FormDetailBreadcrumb
              formName={form?.name || 'Unknown form'}
              onToggleModalState={() => setShowFormInfoModal(true)}
            />
          ),
        },
      ]),
    );

    teCoreAPI[teCoreCallnames.SET_FORM_TYPE]({ formType: form?.formType });
    form?.reservationMode &&
      teCoreAPI[teCoreCallnames.SET_RESERVATION_MODE]({
        mode: form?.reservationMode,
        callback: ({ _res }) => {},
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, form]);

  // Reset all form related state
  useEffect(() => {
    return () => {
      // dispatch(resetActivitiesFetchingHandler());
      dispatch(resetState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submissionPayload = useMemo(() => {
    const initialPayload = { objects: [], types: [], fields: [] };
    const sections = form?.sections || [];
    const submissionValues = submissions.map((submission) => submission.values);
    const teValues = _.isEmpty(submissionValues)
      ? initialPayload
      : getExtIdPropsPayload({
          sections,
          submissionValues,
          objectScope: form?.objectScope,
          activities: paginatedActivites,
        });
    const scopedObjectExtids = submissions.map((s) => s.scopedObject);

    return {
      ...teValues,
      objects: [...teValues.objects, ...scopedObjectExtids],
    };
  }, [form?.objectScope, form?.sections, paginatedActivites, submissions]);

  // Effect to get all TE values into redux state
  useFetchLabelsFromExtIds(submissionPayload);

  return (
    <SSPResourceWrapper
      name={`${formId}__FORM_DETAIL_ACTIVITIES`}
      selectorFn={selectSSPState('activities')}
      fetchFn={(partialQuery?: Partial<ISSPQueryObject>) =>
        fetchActivitiesForForm(formId as string, partialQuery)
      }
      initSSPStateFn={(partialQuery?: Partial<ISSPQueryObject>) =>
        initializeSSPStateProps(partialQuery)
      }
      fetchFilterLookupsFn={() =>
        fetchActivityFilterLookupMapForForm(formId as string)
      }
    >
      <div className='form--wrapper'>
        <TEAntdTabBar
          activeKey={selectedFormDetailTab}
          onChange={(key: string) => dispatch(setFormDetailTab(key))}
          extra={
            selectedFormDetailTab === TAB_CONSTANT.ACTIVITIES ? (
              <JobToolbar />
            ) : null
          }
        >
          <Tabs.TabPane tab='SUBMISSIONS' key={TAB_CONSTANT.SUBMISSIONS}>
            {!selectedSubmissionId ? (
              <SubmissionOverviewPage />
            ) : (
              <SubmissionsDetailPage formInstanceId={selectedSubmissionId} />
            )}
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
          <Tabs.TabPane
            tab='GROUP MANAGEMENT'
            key={TAB_CONSTANT.GROUP_MANAGEMENT}
          >
            <GroupManagementPage />
          </Tabs.TabPane>
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
              <ActivityDesignPage />
            </Tabs.TabPane>
          )}
          {hasAssistedSchedulingPermission && hasActivityDesignPermission && (
            <Tabs.TabPane
              tab='CONSTRAINT PROFILES'
              key={TAB_CONSTANT.CONSTRAINT_PROFILES}
            >
              <ConstraintProfilesPage />
            </Tabs.TabPane>
          )}
          {hasAssistedSchedulingPermission && (
            <Tabs.TabPane tab='JOBS' key={TAB_CONSTANT.JOBS}>
              <JobsPage />
            </Tabs.TabPane>
          )}
        </TEAntdTabBar>
        <FormInfoModal
          isVisible={showFormInfoModal}
          formId={formId as string}
          onHide={() => setShowFormInfoModal(false)}
        />
      </div>
    </SSPResourceWrapper>
  );
};

export default FormPage;
