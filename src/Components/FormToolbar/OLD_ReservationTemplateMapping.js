import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'antd';

// HELPERS
import { validateMapping } from '../../Redux/ReservationTemplateMapping/reservationTemplateMapping.helpers';

// CONSTANTS
import { mappingStatuses } from '../../Constants/mappingStatus.constants';
import { formStatus } from '../../Constants/formStatuses.constants';

const mapStateToProps = (state, ownProps) => ({
  mappings: state.mappings,
  form: state.forms[ownProps.formId],
});

const ReservationTemplateMapping = ({ form, mappings, history }) => {
  if (form.status !== formStatus.ACTIVE) {
    return (
      <div className='activity-template-mapping--wrapper'>
        <span className='activity-template-mapping--status'>
          Form cannot be mapped to a reservation template
        </span>
      </div>
    );
  }

  const mappingStatus = useMemo(() => validateMapping(form._id, mappings), [form, mappings]);

  const label = useMemo(() => {
    switch (mappingStatus) {
      case mappingStatuses.NOT_SET:
        return 'Form has not been mapped to a reservation template';
      case mappingStatuses.COMPLETE:
        return 'Form is mapped to a reservation template';
      default:
        return 'N/A';
    }
  }, [mappingStatus]);

  return (
    <div className='activity-template-mapping--wrapper'>
      <span className='activity-template-mapping--status'>
        {label}
      </span>
      <Button type='link' onClick={() => history.push(`/forms/${form._id}/mapping`)}>
        {mappingStatus === mappingStatuses.NOT_SET ? 'Create mapping' : 'Edit'}
      </Button>
    </div>
  );
};

ReservationTemplateMapping.propTypes = {
  form: PropTypes.object.isRequired,
  mappings: PropTypes.object,
  history: PropTypes.object.isRequired,
};

ReservationTemplateMapping.defaultProps = {
  mappings: {},
};

export default withRouter(connect(mapStateToProps, null)(ReservationTemplateMapping));
