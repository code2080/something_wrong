import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'antd';
import { useDispatch } from 'react-redux';

// ACTIONS
import { deleteActivities } from '../../Redux/Activities/activities.actions';

const HasReservationsAlert = ({ formId }) => {
  const dispatch = useDispatch();

  return (
    <Alert
      style={{ margin: '8px' }}
      className="activity-designer--alert"
      type="warning"
      message="Editing the configuration will delete existing activities"
      description={(
        <React.Fragment>
          <div>
            The form has already been converted to activities with the current design. To edit the design, you must first delete the activities.
          </div>
          <Button size="small" type="link" onClick={() => dispatch(deleteActivities(formId))}>Delete activities now</Button>
        </React.Fragment>
      )}
    />
  );
};

HasReservationsAlert.propTypes = {
  formId: PropTypes.string.isRequired,
};

export default HasReservationsAlert;
