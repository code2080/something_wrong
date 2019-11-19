import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, Dropdown, Icon, Button } from 'antd';

// ACTIONS
import {
  setFormInstanceAcceptanceStatus,
  setFormInstanceSchedulingProgress
} from '../../Redux/FormSubmissions/formSubmissions.actions';

// CONSTANTS
import {
  teCoreAcceptanceStatus,
  teCoreSchedulingProgress,
} from '../../Constants/teCoreProps.constants';

const EDIT_FORM_INSTANCE = 'EDIT_FORM_INSTANCE';
const ACCEPTANCE_STATUS_ACCEPT = 'ACCEPTANCE_STATUS_ACCEPT';
const ACCEPTANCE_STATUS_REJECT = 'ACCEPTANCE_STATUS_REJECT';
const SET_PROGRESS_NOT_SCHEDULED = 'SET_PROGRESS_NOT_SCHEDULED';
const SET_PROGRESS_IN_PROGRESS = 'SET_PROGRESS_IN_PROGRESS';
const SET_PROGRESS_SCHEDULED = 'SET_PROGRESS_SCHEDULED';

const mapActionsToProps = {
  setFormInstanceAcceptanceStatus,
  setFormInstanceSchedulingProgress,
};

const SubmissionActionButton = ({
  formInstance,
  setFormInstanceAcceptanceStatus,
  setFormInstanceSchedulingProgress,
  history,
}) => {
  const setFormInstanceAcceptanceStatusCallback = useCallback(acceptanceStatus => {
    setFormInstanceAcceptanceStatus({
      formInstanceId: formInstance._id,
      acceptanceStatus,
    });
  }, [setFormInstanceAcceptanceStatus]);

  const setFormInstanceSchedulingProgressCallback = useCallback(schedulingProgress => {
    setFormInstanceSchedulingProgress({
      formInstanceId: formInstance._id,
      schedulingProgress,
    });
  }, [setFormInstanceSchedulingProgress]);

  const onClick = useCallback(({ key }) => {
    switch (key) {
      case EDIT_FORM_INSTANCE:
        history.push(`/forms/${formInstance.formId}/${formInstance._id}`);
        break;

      case ACCEPTANCE_STATUS_ACCEPT:
        setFormInstanceAcceptanceStatusCallback(teCoreAcceptanceStatus.ACCEPTED);
        break;

      case ACCEPTANCE_STATUS_REJECT:
        setFormInstanceAcceptanceStatusCallback(teCoreAcceptanceStatus.REJECTED);
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
        console.log(key);
        break;
    }
  }, [setFormInstanceAcceptanceStatusCallback]);

  const actionMenu = useMemo(() => (
    <Menu getPopupContainer={() => document.getElementById("te-prefs-lib")} onClick={onClick}>
      <Menu.Item key={EDIT_FORM_INSTANCE}>View</Menu.Item>
      <Menu.SubMenu title="Set acceptance status...">
        <Menu.Item key={ACCEPTANCE_STATUS_ACCEPT}>Mark submission as accepted</Menu.Item>
        <Menu.Item key={ACCEPTANCE_STATUS_REJECT}>Mark submission as rejected</Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu title="Set scheduling progress...">
        <Menu.Item key={SET_PROGRESS_NOT_SCHEDULED}>Mark submission as not scheduled</Menu.Item>
        <Menu.Item key={SET_PROGRESS_IN_PROGRESS}>Mark submission as in progress</Menu.Item>
        <Menu.Item key={SET_PROGRESS_SCHEDULED}>Mark submission as scheduled</Menu.Item>
      </Menu.SubMenu>
    </Menu>
  ), []);

  return (
    <Dropdown getPopupContainer={() => document.getElementById("te-prefs-lib")} overlay={actionMenu} trigger={['click']}>
      <Button size="small">
        Actions <Icon type="down" />
      </Button>
    </Dropdown>
  );
};

SubmissionActionButton.propTypes = {
  formInstance: PropTypes.object.isRequired,
  setFormInstanceAcceptanceStatus: PropTypes.func.isRequired,
  setFormInstanceSchedulingProgress: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(connect(null, mapActionsToProps)(SubmissionActionButton));
