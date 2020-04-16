import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// COMPONENTS
import RecipientAvatar from '../Avatars/RecipientAvatar';
import ScopedObject from '../FormToolbar/ScopedObject';
import StatusLabel from '../StatusLabel/StatusLabel';
import SectionSelector from '../SectionSelector/SectionSelector';

// STYLES
import '../../Styles/Toolbar.scss';

// CONSTANTS
import {
  teCoreSchedulingProgressProps,
  teCoreAcceptanceStatusProps
} from '../../Constants/teCoreProps.constants';

const mapStateToProps = (state, ownProps) => {
  const { formId, formInstanceId } = ownProps;
  return {
    formInstance: state.submissions[formId][formInstanceId],
  };
};

const FormInstanceToolbar = ({
  formInstance,
  selectedSection,
  onSectionChange,
}) => {
  return (
    <div className="toolbar--wrapper">
      <div className="toolbar--section-flex">
        <span className="label">By:</span>
        <RecipientAvatar firstName={formInstance.firstName} lastName={formInstance.lastName} />
      </div>
      <div className="toolbar--section-flex">
        <span className="label">Scoped object:</span>
        <ScopedObject scopedObjectExtId={formInstance.scopedObject} />
      </div>
      <div className="toolbar--section-flex">
        <span className="label">Acceptance status:</span>
        {formInstance.teCoreProps && formInstance.teCoreProps.acceptanceStatus ? (
          <StatusLabel
            color={teCoreAcceptanceStatusProps[formInstance.teCoreProps.acceptanceStatus].color}
            className="no-margin"
          >
            {teCoreAcceptanceStatusProps[formInstance.teCoreProps.acceptanceStatus].label}
          </StatusLabel>
        ) : 'N/A' }
      </div>
      <div className="toolbar--section-flex">
        <span className="label">Scheduling progress:</span>
        {formInstance.teCoreProps && formInstance.teCoreProps.schedulingProgress ? (
          <StatusLabel
            color={teCoreSchedulingProgressProps[formInstance.teCoreProps.schedulingProgress].color}
            className="no-margin"
          >
            {teCoreSchedulingProgressProps[formInstance.teCoreProps.schedulingProgress].label}
          </StatusLabel>
        ) : 'N/A' }
      </div>
      <div className="toolbar--section-flex adjust-right">
        <SectionSelector selectedSection={selectedSection} onSectionChange={onSectionChange} />
      </div>
    </div>
  );
};

FormInstanceToolbar.propTypes = {
  formInstance: PropTypes.object.isRequired,
  selectedSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  null
)(FormInstanceToolbar);
