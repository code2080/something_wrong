import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// ACTIONS
import { setBreadcrumbs } from '../Redux/GlobalUI/globalUI.actions';

// COMPONENTS
import SectionSelector from '../Components/SectionSelector';
import BaseSection from '../Components/Sections/BaseSection';
import StatusLabel from '../Components/StatusLabel/StatusLabel';

// STYLES
import './FormInstance.scss';

// CONSTANTS
import {
  teCoreSchedulingProgressProps,
  teCoreAcceptanceStatusProps
} from '../Constants/teCoreProps.constants';

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
      {formInstance.teCoreProps && formInstance.teCoreProps.acceptanceStatus && (
        <StatusLabel
          label="Acceptance status:"
          color={teCoreAcceptanceStatusProps[formInstance.teCoreProps.acceptanceStatus].color}
        >
          {teCoreAcceptanceStatusProps[formInstance.teCoreProps.acceptanceStatus].label}
        </StatusLabel>
      )}
      {formInstance.teCoreProps && formInstance.teCoreProps.schedulingProgress && (
        <StatusLabel
          label="Scheduling progress:"
          color={teCoreSchedulingProgressProps[formInstance.teCoreProps.schedulingProgress].color}
        >
          {teCoreSchedulingProgressProps[formInstance.teCoreProps.schedulingProgress].label}
        </StatusLabel>
      )}
      <SectionSelector selectedSection={selectedSection} onSectionChange={selSection => setSelectedSection(selSection)} />
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
