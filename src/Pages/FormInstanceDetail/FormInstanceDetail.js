import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// ACTIONS
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { setTEDataForValues } from '../../Redux/TE/te.actions';
import { fetchManualSchedulingsForFormInstance } from '../../Redux/ManualSchedulings/manualSchedulings.actions';

// COMPONENTS
import BaseSection from '../../Components/Sections/BaseSection';
import { withTECoreAPI } from '../../Components/TECoreAPI';
import FormInstanceToolbar from '../../Components/FormInstanceToolbar/FormInstanceToolbar';
import AutomaticSchedulingToolbar from '../../Components/AutomaticSchedulingToolbar/AutomaticSchedulingToolbar';

// SELECTORS
import { getExtIdPropsPayload } from '../../Redux/Integration/integration.selectors';

// STYLES
import './FormInstanceDetail.scss';

// CONSTANTS
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

  // Effect to get all TE values
  useEffect(() => {
    async function exec() {
      const extIdProps = await teCoreAPI.getExtIdProps(teValues);
      setTEDataForValues(extIdProps || {});
    }
    exec();
  }, []);

  return (
    <React.Fragment>
      <FormInstanceToolbar
        formId={formInstance.formId}
        formInstanceId={formInstance._id}
      />
      <AutomaticSchedulingToolbar
        formId={formInstance.formId}
        formInstanceId={formInstance._id}
      />
      <div className="form-instance--wrapper">
        {(sections || [])
          .map(section => <BaseSection section={section} key={section._id} />)
        }
      </div>
    </React.Fragment>
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
};

FormInstancePage.defaultProps = {
  sections: [],
};

export default connect(mapStateToProps, mapActionsToProps)(withTECoreAPI(FormInstancePage));
