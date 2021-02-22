import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Icon } from 'antd';

// COMPONENTS
import { useTECoreAPI } from '../../../../Hooks/TECoreApiHooks';

// SELECTORS
import { selectFormInstance } from '../../../../Redux/FormSubmissions/formSubmissions.selectors.ts';
import { selectFormInstanceObjectRequests } from '../../../../Redux/ObjectRequests/ObjectRequests.selectors';
import { selectTECorePayloadForActivity } from '../../../../Redux/Activities/activities.selectors';

const SelectActivityButton = ({ activity }) => {
  const teCoreAPI = useTECoreAPI();
  const formInstance = useSelector(selectFormInstance)(activity.formId, activity.formInstanceId);
  const formInstanceRequests = useSelector(selectFormInstanceObjectRequests(formInstance));
  const teCorePayload = useSelector(selectTECorePayloadForActivity)(activity.formId, activity.formInstanceId, activity._id, formInstanceRequests);

  const onSelectAllCallback = () => {
    if (teCorePayload)
      teCoreAPI.populateSelection(teCorePayload);
  };

  return (
    <div className="scheduling-actions--button" onClick={onSelectAllCallback}>
      <Icon type="select" />
    </div>
  );
};

SelectActivityButton.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default SelectActivityButton;
