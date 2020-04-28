import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, Dropdown, Icon, Button } from 'antd';

// COMPONENTS
import FormInstanceAcceptanceStatusModal from '../../Modals/FormInstanceAcceptanceStatus';

// ACTIONS
import { setFormInstanceSchedulingProgress } from '../../../Redux/FormSubmissions/formSubmissions.actions';

// CONSTANTS
import { teCoreSchedulingProgress } from '../../../Constants/teCoreProps.constants';

const EDIT_FORM_INSTANCE = 'EDIT_FORM_INSTANCE';
const SET_PROGRESS_NOT_SCHEDULED = 'SET_PROGRESS_NOT_SCHEDULED';
const SET_PROGRESS_IN_PROGRESS = 'SET_PROGRESS_IN_PROGRESS';
const SET_PROGRESS_SCHEDULED = 'SET_PROGRESS_SCHEDULED';
const SET_ACCEPTANCE_STATUS = 'SET_ACCEPTANCE_STATUS';

const mapActionsToProps = {
  setFormInstanceSchedulingProgress,
};

const SubmissionActionButton = ({
  formInstance,
  setFormInstanceSchedulingProgress,
  history,
}) => {
  // State var to hold modal's visibility
  const [isAcceptanceStatusModalOpen, setIsAcceptanceStatusModalOpen] = useState(false);

  const setFormInstanceSchedulingProgressCallback = useCallback(schedulingProgress => {
    setFormInstanceSchedulingProgress({
      formInstanceId: formInstance._id,
      schedulingProgress,
    });
  }, [setFormInstanceSchedulingProgress]);

  const onClick = useCallback(({ key, domEvent }) => {
    domEvent.stopPropagation();

    switch (key) {
      case SET_ACCEPTANCE_STATUS:
        setIsAcceptanceStatusModalOpen(true);
        break;
      case EDIT_FORM_INSTANCE:
        history.push(`/forms/${formInstance.formId}/form-instances/${formInstance._id}`);
        break;
      case SET_PROGRESS_NOT_SCHEDULED:
        setFormInstanceSchedulingProgressCallback(teCoreSchedulingProgress.NOT_SCHEDULED);
        break;
      case SET_PROGRESS_IN_PROGRESS:
        setFormInstanceSchedulingProgressCallback(teCoreSchedulingProgress.IN_PROGRESS);
        break;
      case SET_PROGRESS_SCHEDULED:
        setFormInstanceSchedulingProgressCallback(teCoreSchedulingProgress.SCHEDULING_FINISHED);
        break;
      default:
        break;
    }
  }, [setFormInstanceSchedulingProgressCallback]);

  const actionMenu = useMemo(() => (
    <Menu
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      onClick={onClick}
    >
      <Menu.Item key={EDIT_FORM_INSTANCE}>View</Menu.Item>
      <Menu.Item key={SET_ACCEPTANCE_STATUS}>Set acceptance status ...</Menu.Item>
      <Menu.SubMenu title="Set scheduling progress">
        <Menu.Item key={SET_PROGRESS_NOT_SCHEDULED}>
          Mark submission as not scheduled
        </Menu.Item>
        <Menu.Item key={SET_PROGRESS_IN_PROGRESS}>
          Mark submission as in progress
        </Menu.Item>
        <Menu.Item key={SET_PROGRESS_SCHEDULED}>
          Mark submission as scheduled
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  ), []);

  return (
    <React.Fragment>
      <Dropdown
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        overlay={actionMenu}
        trigger={['click']}
      >
        <Button size="small" onClick={e => e.stopPropagation()}>
          Actions <Icon type="down" />
        </Button>
      </Dropdown>
      <FormInstanceAcceptanceStatusModal
        isVisible={isAcceptanceStatusModalOpen}
        onClose={() => setIsAcceptanceStatusModalOpen(false)}
        formId={formInstance.formId}
        formInstanceId={formInstance._id}
      />
    </React.Fragment>
  );
};

SubmissionActionButton.propTypes = {
  formInstance: PropTypes.object.isRequired,
  setFormInstanceSchedulingProgress: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(connect(null, mapActionsToProps)(SubmissionActionButton));
