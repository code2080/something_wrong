import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Tabs } from 'antd';

// COMPONENTS
import TEAntdTabBar from '../../Components/TEAntdTabBar';

// HOOKS
import { useFetchLabelsFromExtIds, useTECoreAPI } from '../../Hooks/TECoreApiHooks';

// ACTIONS
import { fetchFormSubmissions, toggleFormInstanceStarringStatus } from '../../Redux/FormSubmissions/formSubmissions.actions';
import { fetchMappings } from '../../Redux/ActivityDesigner/activityDesigner.actions';
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { fetchActivitiesForForm } from '../../Redux/Activities/activities.actions';
import { fetchDataForDataSource } from '../../Redux/Integration/integration.actions';
import { loadFilter } from '../../Redux/Filters/filters.actions';

// SELECTORS
import { selectSubmissions } from '../../Redux/FormSubmissions/formSubmissions.selectors';
import { getExtIdPropsPayload } from '../../Redux/Integration/integration.selectors';
import { selectForm } from '../../Redux/Forms/forms.selectors';

// COMPONENTS
// import FormToolbar from '../../Components/FormToolbar/FormToolbar';

// PAGES
import SubmissionsPage from './pages/submissions.page';
import FormInfoPage from './pages/formInfo.page';
import ActivitiesPage from './pages/activities.page';
import ActivityDesignPage from './pages/activityDesigner.page';

// CONSTANTS
import { initialState as initialPayload } from '../../Redux/TE/te.helpers';
import { teCoreCallnames } from '../../Constants/teCoreActions.constants';

const mapActionsToProps = {
  fetchFormSubmissions,
  fetchMappings,
  fetchActivitiesForForm,
  setBreadcrumbs,
  fetchDataForDataSource,
  toggleFormInstanceStarringStatus,
  loadFilter,
};

const FormPage = ({
  fetchFormSubmissions,
  fetchActivitiesForForm,
  setBreadcrumbs,
  fetchMappings,
  loadFilter,
}) => {
  const teCoreAPI = useTECoreAPI();
  const { formId } = useParams();
  const form = useSelector(selectForm)(formId);
  const submissions = useSelector(selectSubmissions)(formId);

  useEffect(() => {
    fetchFormSubmissions(formId);
    fetchMappings(formId);
    fetchActivitiesForForm(formId);
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formId}`, label: form.name }
    ]);
    loadFilter({ filterId: formId });
    teCoreAPI[teCoreCallnames.SET_FORM_TYPE]({ formType: form.formType });
    form.reservationmode && teCoreAPI[teCoreCallnames.SET_RESERVATION_MODE]({ mode: form.reservationmode, callback: ({res}) => {} });
  }, [formId]);

  const payload = useMemo(() => {
    const sections = form.sections;
    const submissionValues = submissions.reduce((acc, submission) => ({
      ...acc,
      ...submission.values
    }), {});
    const teValues = _.isEmpty(submissionValues)
      ? initialPayload
      : getExtIdPropsPayload({ sections, submissionValues, objectScope: form.objectScope });
    const scopedObjectExtids = submissions.map(s => s.scopedObject)

    return {
      ...teValues,
      objects: [
        ...teValues.objects,
        ...scopedObjectExtids
      ],
    }
  }, [submissions, form]);

  // Effect to get all TE values into redux state
  useFetchLabelsFromExtIds(payload);

  return (
    <div className="form--wrapper">
      {/* <FormToolbar formId={formId} onClickMore={handleClickMore} /> */}
      <TEAntdTabBar defaultActiveKey="SUBMISSIONS">
        <Tabs.TabPane tab="FORM INFO" key="FORM_INFO">
          <FormInfoPage />
        </Tabs.TabPane>
        <Tabs.TabPane tab="SUBMISSIONS" key="SUBMISSIONS">
          <SubmissionsPage />
        </Tabs.TabPane>
        <Tabs.TabPane tab="ACTIVITIES" key="ACTIVITIES">
          <ActivitiesPage />
        </Tabs.TabPane>
        <Tabs.TabPane tab="ACTIVITY DESIGNER" key="ACTIVITY_DESIGNER">
          <ActivityDesignPage />
        </Tabs.TabPane>
      </TEAntdTabBar>
      {/* showFormInfo && <FormInfo formId={formId} /> */}
    </div>
  );
};

FormPage.propTypes = {
  fetchFormSubmissions: PropTypes.func.isRequired,
  fetchActivitiesForForm: PropTypes.func.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  fetchMappings: PropTypes.func.isRequired,
  loadFilter: PropTypes.func.isRequired,
};

FormPage.defaultProps = {
  isLoadingSubmissions: false,
  isSaving: false,
  scopedObjectIds: [],
};

export default withRouter(connect(null, mapActionsToProps)(FormPage));
