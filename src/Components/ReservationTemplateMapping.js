import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'antd';

// COMPONENTS
import withTECoreAPI from '../Components/TECoreAPI/withTECoreAPI';

// HELPERS
import { getMappingStatus } from '../Redux/Mapping/mappings.helpers';

// CONSTANTS
import { mappingStatuses } from '../Constants/mappingStatus.constants';

const mapStateToProps = (state, ownProps) => ({
  mappings: state.mappings[ownProps.formId],
  form: state.forms[ownProps.formId],
});

const ReservationTemplateMapping = ({ form, mappings, teCoreAPI, history }) => {
  const [mappingStatus, setMappingStatus] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    async function exec() {
      // Get the selected template name
      const selectedTemplate = await teCoreAPI.getSelectedReservationTemplate();
      setSelectedTemplate(selectedTemplate);
      // Check if we have a mapping for that template
      const mappingStatus = getMappingStatus(mappings[selectedTemplate]);
      setMappingStatus(mappingStatus);
    }
    exec();
  }, [mappings, setMappingStatus]);

  const label = useMemo(() => {
    switch (mappingStatus) {
      case mappingStatuses.NOT_SET:
        return `Form is not mapped to ${selectedTemplate}`;
      case mappingStatuses.PARTIAL:
        return `The mapping for form to ${selectedTemplate} is incomplete`;
      case mappingStatuses.ALL_MANDATORY:
        return `All mandatory properties are mapped to ${selectedTemplate}`;
      case mappingStatuses.COMPLETE:
        return `Form is mapped to ${selectedTemplate}`;
      default:
        return 'N/A';
    }
  }, [mappingStatus, selectedTemplate]);

  return (
    <div className="reservation-template-mapping--wrapper">
      <span className="reservation-template-mapping--status">
        {label}
      </span>
      <Button type="link" onClick={() => history.push(`/forms/${form._id}/mapping`)}>
        {mappingStatus === mappingStatuses.NOT_SET ? 'Create mapping' : 'Edit'}
      </Button>
    </div>
  );
};

ReservationTemplateMapping.propTypes = {
  form: PropTypes.object.isRequired,
  mappings: PropTypes.object,
  teCoreAPI: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

ReservationTemplateMapping.defaultProps = {
  mappings: {},
};

export default withRouter(connect(mapStateToProps, null)(withTECoreAPI(ReservationTemplateMapping)));
