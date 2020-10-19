import React, { useEffect, useState, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// ACTIONS
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { fetchManualSchedulingsForFormInstance } from '../../Redux/ManualSchedulings/manualSchedulings.actions';
import { fetchActivitiesForFormInstance } from '../../Redux/Activities/activities.actions';

// COMPONENTS
import BaseSection from '../../Components/Sections/BaseSection';
import { withTECoreAPI } from '../../Components/TECoreAPI';
import FormInstanceToolbar from '../../Components/FormInstanceToolbar/FormInstanceToolbar';
import ActivitiesOverview from './ActivitiesOverview';
import FormInfo from '../../Components/Sections/FormInfo';
import SpotlightMask from '../../Components/SpotlightMask';

// HELPERS
import { hasAssistedSchedulingPermissions } from '../../Utils/permissionHelpers';

// SELECTORS
import { getExtIdPropsPayload } from '../../Redux/Integration/integration.selectors';
import { selectFormInstanceObjectRequests } from '../../Redux/ObjectRequests/ObjectRequests.selectors';

// STYLES
import './FormInstanceDetail.scss';
import { useFetchLabelsFromExtIds } from '../../Hooks/TECoreApiHooks';

const tabs = {
  OVERVIEW: 'OVERVIEW',
  ACTIVITIES: 'ACTIVITIES',
};

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId, formInstanceId } } } = ownProps;
  return {
    formName: state.forms[formId].name,
    formInstance: state.submissions[formId][formInstanceId],
    sections: state.forms[formId].sections,
    activities: state.activities[formId][formInstanceId]
  };
};

const mapActionsToProps = {
  setBreadcrumbs,
  fetchManualSchedulingsForFormInstance,
  fetchActivitiesForFormInstance,
};

const FormInstancePage = ({
  formInstance,
  formName,
  sections,
  setBreadcrumbs,
  teCoreAPI,
  fetchManualSchedulingsForFormInstance,
  fetchActivitiesForFormInstance,
  activities,
}) => {
  const objectRequests = useSelector(selectFormInstanceObjectRequests(formInstance._id));
  const [showFormInfo, setShowFormInfo] = useState(false);
  const externalActionRef = useSelector(state => state.globalUI.spotlightPositionInfo);

  // Effect to update breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formInstance.formId}`, label: formName },
      { path: `/forms/${formInstance.formId}/form-instances/${formInstance._id}`, label: `Submission from ${formInstance.submitter}` }
    ]);
  }, []);

  // Effect to fetch all manual schedulings
  useEffect(() => {
    fetchManualSchedulingsForFormInstance({ formInstanceId: formInstance._id })
  }, []);

  // Effect to fetch activities
  useEffect(() => {
    fetchActivitiesForFormInstance(formInstance.formId, formInstance._id);
  }, []);
  
  const handleClickMore = () => setShowFormInfo(!showFormInfo);

  // Effect to get all TE values into redux state
  const payload = useMemo(() => getExtIdPropsPayload({ sections, objectRequests: objectRequests, submissionValues: formInstance.values, activities }), [formInstance, sections, activities]);
  useFetchLabelsFromExtIds(teCoreAPI, payload);

  // State var to hold active tab
  const [activeView, setActiveView] = useState(tabs.OVERVIEW);

  return (
    <div className="form-instance--wrapper">
      <SpotlightMask spotlightPositionInfo={externalActionRef} />
      <FormInstanceToolbar
        formId={formInstance.formId}
        formInstanceId={formInstance._id}
        onClickMore={handleClickMore}
      />
      {showFormInfo && <FormInfo formId={formInstance.formId} />}
      {hasAssistedSchedulingPermissions() && (
        <div className="form-instance--tabs">
          <div
            className={`form-instance--tabs__tab ${activeView === tabs.OVERVIEW ? 'is-active' : ''}`}
            onClick={() => setActiveView(tabs.OVERVIEW)}
          >
            Overview
          </div>
          <div
            className={`form-instance--tabs__tab ${activeView === tabs.ACTIVITIES ? 'is-active' : ''}`}
            onClick={() => setActiveView(tabs.ACTIVITIES)}
          >
            Activities
          </div>
        </div>
      )}
      {activeView === tabs.OVERVIEW
        ? (sections || []).map(section => <BaseSection section={section} key={section._id} />)
        : <ActivitiesOverview formId={formInstance.formId} formInstanceId={formInstance._id} />
      }
    </div>
  );
};

FormInstancePage.propTypes = {
  formInstance: PropTypes.object.isRequired,
  sections: PropTypes.array,
  formName: PropTypes.string.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
  fetchManualSchedulingsForFormInstance: PropTypes.func.isRequired,
  fetchActivitiesForFormInstance: PropTypes.func.isRequired,
};

FormInstancePage.defaultProps = {
  sections: [],
};

export default connect(mapStateToProps, mapActionsToProps)(withTECoreAPI(FormInstancePage));
