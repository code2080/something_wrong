import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toProgressLabel, toAcceptanceLabel } from '../Constants/teCoreProps.constants';

// ACTIONS
import { setBreadcrumbs } from '../Redux/GlobalUI/globalUI.actions';

// COMPONENTS
import SectionSelector from '../Components/SectionSelector';
import BaseSection from '../Components/Sections/BaseSection';

// CONSTANTS
const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId, formInstanceId } } } = ownProps;
  return {
    formName: state.forms[formId].name,
    formInstance: state.submissions[formId][formInstanceId],
    sections: state.forms[formId].sections,
  };
};

const mapActionsToProps = {
  setBreadcrumbs,
};

/**
 *
 * @todo
 * build out extraction function for table section
 */
const FormInstancePage = ({ formInstance, formName, sections, setBreadcrumbs }) => {
  useEffect(() => {
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formInstance.formId}`, label: formName },
      { path: `/forms/${formInstance.formId}/${formInstance._id}`, label: `Submission from ${formInstance.submitter}` }
    ]);
  }, []);

  const [selectedSection, setSelectedSection] = useState('ALL_SECTIONS');

  return (
    <div className="form-instance--wrapper">
      <SectionSelector selectedSection={selectedSection} onSectionChange={selSection => setSelectedSection(selSection)} />
      <p><span style={{ color: 'rgb(128, 128, 128)' }}>Acceptance status:</span> {formInstance.teCoreProps ? toAcceptanceLabel(formInstance.teCoreProps.acceptanceStatus) : ''}</p>
      <p><span style={{ color: 'rgb(128, 128, 128)' }}>Scheduling progress:</span> {formInstance.teCoreProps ? toProgressLabel(formInstance.teCoreProps.schedulingProgress) : ''}</p>
      {(sections || [])
        .filter(section => {
          if (selectedSection === 'ALL_SECTIONS') return true;
          return section._id === selectedSection;
        })
        .map(section => <BaseSection section={section} key={section._id} />)
      }
    </div>
  );
};

FormInstancePage.propTypes = {
  formInstance: PropTypes.object.isRequired,
  sections: PropTypes.array,
  formName: PropTypes.string.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
};

FormInstancePage.defaultProps = {
  sections: [],
};

export default connect(mapStateToProps, mapActionsToProps)(FormInstancePage);
