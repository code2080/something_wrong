import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { Tabs } from 'antd';

// COMPONENTS
import TEAntdTabBar from '../../Components/TEAntdTabBar';

// HOOKS
import { useFetchLabelsFromExtIds, useTECoreAPI } from '../../Hooks/TECoreApiHooks';

// ACTIONS
import { fetchFormSubmissions } from '../../Redux/FormSubmissions/formSubmissions.actions';
import { fetchMappings } from '../../Redux/ActivityDesigner/activityDesigner.actions';
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { fetchActivitiesForForm } from '../../Redux/Activities/activities.actions';
import { loadFilter } from '../../Redux/Filters/filters.actions';

// SELECTORS
import { selectSubmissions } from '../../Redux/FormSubmissions/formSubmissions.selectors';
import { getExtIdPropsPayload } from '../../Redux/Integration/integration.selectors';
import { selectForm } from '../../Redux/Forms/forms.selectors';

// PAGES
import SubmissionsPage from './pages/submissions.page';
import FormInfoPage from './pages/formInfo.page';
import ActivitiesPage from './pages/activities.page';
import ActivityDesignPage from './pages/activityDesigner.page';
import ConstraintManagerPage from './pages/constraintManager.page';

// CONSTANTS
import { initialState as initialPayload } from '../../Redux/TE/te.helpers';
import { teCoreCallnames } from '../../Constants/teCoreActions.constants';

const FormPage = () => {
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();
  const { formId } = useParams();
  const form = useSelector(selectForm)(formId);
  const submissions = useSelector(selectSubmissions)(formId);

  useEffect(() => {
    dispatch(fetchFormSubmissions(formId));
    dispatch(fetchMappings(formId));
    dispatch(fetchActivitiesForForm(formId));
    dispatch(setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formId}`, label: form.name }
    ]));
    dispatch(loadFilter({ filterId: formId }));
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
        <Tabs.TabPane tab="CONSTRAINT MANAGER" key="CONSTRAINT_MANAGER">
          <ConstraintManagerPage />
        </Tabs.TabPane>
      </TEAntdTabBar>
    </div>
  );
};

export default FormPage;
