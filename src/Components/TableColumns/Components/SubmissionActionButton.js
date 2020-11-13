import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, Dropdown, Icon, Button } from 'antd';

// COMPONENTS
import FormInstanceAcceptanceStatusModal from '../../Modals/FormInstanceAcceptanceStatus';

// ACTIONS
import { setFormInstanceSchedulingProgress, fetchFormSubmissions, sendReviewerLink } from '../../../Redux/FormSubmissions/formSubmissions.actions';

// CONSTANTS
import { teCoreSchedulingProgress } from '../../../Constants/teCoreProps.constants';
import { formInstanceStatusTypes } from "../../../Constants/formInstanceStatuses.constants";

const EDIT_FORM_INSTANCE = 'EDIT_FORM_INSTANCE';
const SET_PROGRESS_NOT_SCHEDULED = 'SET_PROGRESS_NOT_SCHEDULED';
const SET_PROGRESS_IN_PROGRESS = 'SET_PROGRESS_IN_PROGRESS';
const SET_PROGRESS_SCHEDULED = 'SET_PROGRESS_SCHEDULED';
const SET_ACCEPTANCE_STATUS = 'SET_ACCEPTANCE_STATUS';
const NOTIFY_USER_WITH_REVIEW_LINK = 'NOTIFY_USER_WITH_REVIEW_LINK';
const mapActionsToProps = dispatch => ({
  setFormInstanceSchedulingProgress: async ({ formInstanceId, schedulingProgress, formId }) => {
    await dispatch(setFormInstanceSchedulingProgress({ formInstanceId, schedulingProgress }));
    // fetch submissions for getting all reviewLink
    dispatch(fetchFormSubmissions(formId));
  },
  remindUser({ formInstanceId }) {
    dispatch(sendReviewerLink({ formInstanceId }));
  },
});

const SubmissionActionButton = ({
  formInstance,
  setFormInstanceSchedulingProgress,
  remindUser,
  history,
}) => {
  // State var to hold modal's visibility
  const [isAcceptanceStatusModalOpen, setIsAcceptanceStatusModalOpen] = useState(false);

  const setFormInstanceSchedulingProgressCallback = useCallback(schedulingProgress => {
    setFormInstanceSchedulingProgress({
      formInstanceId: formInstance._id,
      schedulingProgress,
      formId: formInstance.formId,
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
      case NOTIFY_USER_WITH_REVIEW_LINK:
        remindUser({ formInstanceId: formInstance._id });
        break;
      default:
        break;
    }
  }, [setFormInstanceSchedulingProgressCallback, formInstance]);

  const actionMenu = useMemo(() => (
    <Menu
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      onClick={onClick}
    >
      <Menu.Item key={EDIT_FORM_INSTANCE}>View</Menu.Item>
      {formInstance.reviewLink && (
        <Menu.Item key={NOTIFY_USER_WITH_REVIEW_LINK}>Notify user with review link</Menu.Item>
      )}
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
  ), [formInstance]);

  return (
    <React.Fragment>
      <Dropdown
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        overlay={actionMenu}
        trigger={['click']}
      >
        <Button type="link" size="small" onClick={e => e.stopPropagation()}>
          <Icon type="more" />
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
  remindUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(connect(null, mapActionsToProps)(SubmissionActionButton));
