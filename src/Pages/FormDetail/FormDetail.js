import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { Tabs } from 'antd';

// COMPONENTS
import TEAntdTabBar from '../../Components/TEAntdTabBar';
import JobToolbar from '../../Components/JobToolbar/JobToolbar';

// HOOKS
import { useTECoreAPI } from '../../Hooks/TECoreApiHooks';

// ACTIONS
import { fetchFormSubmissions } from '../../Redux/FormSubmissions/formSubmissions.actions';
import { fetchMappings } from '../../Redux/ActivityDesigner/activityDesigner.actions';
import {
  setBreadcrumbs,
  setFormDetailTab,
} from '../../Redux/GlobalUI/globalUI.actions';
// import { fetchActivitiesForForm } from '../../Redux/Activities/activities.actions';
import { fetchActivityTagsForForm } from '../../Redux/ActivityTag/activityTag.actions';
import { loadFilter } from '../../Redux/Filters/filters.actions';
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
  ASSISTED_SCHEDULING_PERMISSION_NAME,
  AE_ACTIVITY_PERMISSION,
} from '../../Constants/permissions.constants';

// PAGES
import ObjectRequestsPage from './pages/objectRequests.page';
import ConstraintManagerPage from './pages/constraintManager.page';
import ActivityDesignPage from './pages/activityDesigner.page';
import ActivitiesPage from './pages/activities.page';
import FormInfoPage from './pages/formInfo.page';
import SubmissionsPage from './pages/submissions.page';
import JointTeachingPage from './pages/jointTeaching.page';

export const TAB_CONSTANT = {
  FORM_INFO: 'FORM_INFO',
  SUBMISSIONS: 'SUBMISSIONS',
  OBJECT_REQUESTS: 'OBJECT_REQUESTS',
  ACTIVITIES: 'ACTIVITIES',
  ACTIVITY_DESIGNER: 'ACTIVITY_DESIGNER',
  CONSTRAINT_MANAGER: 'CONSTRAINT_MANAGER',
  JOINT_TEACHING: 'JOINT_TEACHING',
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
  const selectedFormDetailTab = useSelector(selectFormDetailTab);
  const hasActivityDesignPermission = useSelector(
    hasPermission(AE_ACTIVITY_PERMISSION),
  );
  const isBeta = useSelector(selectIsBetaOrDev);
  const hasAssistedSchedulingPermission = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );
  const reqs = useSelector(selectFormObjectRequest(formId));
  const formHasObjReqs = !_.isEmpty(reqs);

  useEffect(() => {
    dispatch(fetchFormSubmissions(formId));
    dispatch(fetchMappings(form));
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

  // Effect to get all TE values into redux state
  // useFetchLabelsFromExtIds(submissionPayload);

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
        {isBeta && hasAssistedSchedulingPermission && (
          <Tabs.TabPane tab='JOINT TEACHING' key={TAB_CONSTANT.JOINT_TEACHING}>
            <JointTeachingPage />
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
