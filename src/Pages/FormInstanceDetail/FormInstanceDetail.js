import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// ACTIONS
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { setTEDataForValues } from '../../Redux/TE/te.actions';
import { fetchManualSchedulingsForFormInstance } from '../../Redux/ManualSchedulings/manualSchedulings.actions';
import { fetchActivitiesForFormInstance } from '../../Redux/Activities/activities.actions';

// COMPONENTS
import BaseSection from '../../Components/Sections/BaseSection';
import { withTECoreAPI } from '../../Components/TECoreAPI';
import FormInstanceToolbar from '../../Components/FormInstanceToolbar/FormInstanceToolbar';
import ActivitiesOverview from './ActivitiesOverview';

// HELPERS
import { hasAssistedSchedulingPermissions } from '../../Utils/permissionHelpers';

// SELECTORS
import { getExtIdPropsPayload } from '../../Redux/Integration/integration.selectors';

// STYLES
import './FormInstanceDetail.scss';

// CONSTANTS
const tabs = {
  OVERVIEW: 'OVERVIEW',
  ACTIVITIES: 'ACTIVITIES',
};

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId, formInstanceId } } } = ownProps;
  const sections = state.forms[formId].sections;
  const values = state.submissions[formId][formInstanceId].values;
  const teValues = getExtIdPropsPayload(sections, values, state);
  return {
    formName: state.forms[formId].name,
    formInstance: state.submissions[formId][formInstanceId],
    teValues,
    sections,
  };
};

const mapActionsToProps = {
  setBreadcrumbs,
  setTEDataForValues,
  fetchManualSchedulingsForFormInstance,
  fetchActivitiesForFormInstance,
};

const FormInstancePage = ({
  formInstance,
  formName,
  sections,
  teValues,
  setBreadcrumbs,
  teCoreAPI,
  setTEDataForValues,
  fetchManualSchedulingsForFormInstance,
  fetchActivitiesForFormInstance,
}) => {
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

  // Effect to get all TE values
  useEffect(() => {
    async function exec() {
      const extIdProps = await teCoreAPI.getExtIdProps(teValues);
      setTEDataForValues(extIdProps || {});
    }
    exec();
  }, []);

  // State var to hold active tab
  const [activeView, setActiveView] = useState(tabs.OVERVIEW);

  return (
    <div className="form-instance--wrapper">
      <FormInstanceToolbar
        formId={formInstance.formId}
        formInstanceId={formInstance._id}
      />
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
  teValues: PropTypes.object.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
  setTEDataForValues: PropTypes.func.isRequired,
  fetchManualSchedulingsForFormInstance: PropTypes.func.isRequired,
  fetchActivitiesForFormInstance: PropTypes.func.isRequired,
};

FormInstancePage.defaultProps = {
  sections: [],
};

export default connect(mapStateToProps, mapActionsToProps)(withTECoreAPI(FormInstancePage));
