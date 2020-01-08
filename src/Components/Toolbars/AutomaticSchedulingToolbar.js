import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'antd';

// HELPERS
import { getMappingStatus } from '../../Redux/Mapping/mappings.helpers';
import { getReservationsForFormInstance } from '../../Redux/Reservations/reservations.helpers';

// COMPONENTS
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';
import SchedulingProgress from '../AutomaticScheduling/SchedulingProgress';

// STYLES
import './Toolbar.scss';

// CONSTANTS
import { mappingStatuses } from '../../Constants/mappingStatus.constants';

const mapStateToProps = (state, ownProps) => {
  const { formId, formInstanceId } = ownProps;
  return {
    formInstance: state.submissions[formId][formInstanceId],
    mappings: state.mappings[formId],
    reservations: getReservationsForFormInstance(state.reservations, formId, formInstanceId),
  };
};

const AutomaticSchedulingToolbar = ({
  formInstance,
  mappings,
  reservations,
  teCoreAPI,
  history,
}) => {
  const [mappingStatus, setMappingStatus] = useState(false);

  useEffect(() => {
    async function exec() {
      // Get the selected template name
      const selectedTemplate = await teCoreAPI.getSelectedReservationTemplate();
      // Check if we have a mapping for that template
      const mappingStatus = getMappingStatus(mappings[selectedTemplate]);
      setMappingStatus(mappingStatus);
    }
    exec();
  }, [mappings, setMappingStatus]);

  const onConfigureMappingCallback = useCallback(() => {
    history.push(`/forms/${formInstance.formId}/mapping`);
  }, [formInstance, history]);

  const onConvertToReservations = useCallback(() => {
    history.push(`/forms/${formInstance.formId}/form-instances/${formInstance._id}/reservations`);
  }, [formInstance, history]);

  const onScheduleReservations = useCallback(() => {
    console.log('Should schedule all outstanding reservations');
  }, []);

  return (
    <div className="toolbar--wrapper">
      {[mappingStatuses.NOT_SET, mappingStatuses.PARTIAL].indexOf(mappingStatus) > -1 && (
        <div className="toolbar--section-flex">
          <span className="label">Almost ready for automatic scheduling!</span>
          <Button type="link" size="small" onClick={onConfigureMappingCallback}>
            Configure the form's mapping to the reservation template to get started
          </Button>
        </div>
      )}
      {[mappingStatuses.COMPLETE, mappingStatuses.ALL_MANDATORY].indexOf(mappingStatus) > -1 &&
        reservations &&
        reservations.length &&
        reservations.length > 0 ? (
          <React.Fragment>
            <div className="toolbar--section-flex">
              <span className="label">Ready for automatic scheduling!</span>
              <Button type="link" size="small" onClick={onConvertToReservations}>
                View reservation summary
              </Button>
            </div>
            <div className="toolbar--section-flex">
              <span className="label">Progress</span>
              <SchedulingProgress formId={formInstance.formId} formInstanceId={formInstance._id} />
            </div>
            <div className="toolbar--section-flex adjust-right">
              <Button size="small" onClick={onScheduleReservations}>
                Schedule all reservations
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <div className="toolbar--section-flex">
            <span className="label">Ready for automatic scheduling!</span>
            <Button type="link" size="small" onClick={onConvertToReservations}>
              Convert submissions to reservations to get started
            </Button>
          </div>
        )
      }
    </div>
  );
};

AutomaticSchedulingToolbar.propTypes = {
  formInstance: PropTypes.object.isRequired,
  mappings: PropTypes.object,
  reservations: PropTypes.array,
  teCoreAPI: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

AutomaticSchedulingToolbar.defaultProps = {
  mappings: null,
  reservations: [],
};

export default withRouter(connect(mapStateToProps, null)(withTECoreAPI(AutomaticSchedulingToolbar)));
