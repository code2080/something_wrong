import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// ACTIONS
import { setBreadcrumbs } from '../Redux/GlobalUI/globalUI.actions';
import { setTEDataForValues } from '../Redux/TE/te.actions';

// COMPONENTS
import BaseSection from '../Components/Sections/BaseSection';
import { withTECoreAPI } from '../Components/TECoreAPI';
import FormInstanceToolbar from '../Components/Toolbars/FormInstanceToolbar';
import AutomaticSchedulingToolbar from '../Components/Toolbars/AutomaticSchedulingToolbar';

// SELECTORS
import { getExtIdPropsPayload } from '../Redux/Integration/integration.selectors';

// STYLES
import './FormInstance.scss';

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
};

const FormInstancePage = ({
  formInstance,
  formName,
  sections,
  teValues,
  setBreadcrumbs,
  teCoreAPI,
  setTEDataForValues
}) => {
  // Effect to update breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formInstance.formId}`, label: formName },
      { path: `/forms/${formInstance.formId}/form-instances/${formInstance._id}`, label: `Submission from ${formInstance.submitter}` }
    ]);
  }, []);

  // Effect to get all TE values
  useEffect(() => {
    async function exec() {
      const extIdProps = await teCoreAPI.getExtIdProps(teValues);
      setTEDataForValues(extIdProps || {});
    }
    exec();
  }, []);

  // State var to hold section selectionn
  const [selectedSection, setSelectedSection] = useState('ALL_SECTIONS');

  return (
    <React.Fragment>
      <FormInstanceToolbar
        formId={formInstance.formId}
        formInstanceId={formInstance._id}
        selectedSection={selectedSection}
        onSectionChange={selSection => setSelectedSection(selSection)}
      />
      <AutomaticSchedulingToolbar
        formId={formInstance.formId}
        formInstanceId={formInstance._id}
      />
      <div className="form-instance--wrapper">
        {(sections || [])
          .filter(section => {
            if (selectedSection === 'ALL_SECTIONS') return true;
            return section._id === selectedSection;
          })
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
};

FormInstancePage.defaultProps = {
  sections: [],
};

export default connect(mapStateToProps, mapActionsToProps)(withTECoreAPI(FormInstancePage));
