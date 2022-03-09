/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

// COMPONENTS
import FormInstanceAcceptanceStatusModal from '../../Modals/FormInstanceAcceptanceStatus';

// ACTIONS
import { setFormDetailTab } from '../../../Redux/GlobalUI/globalUI.actions';
import {
  fetchFormSubmissions,
  sendReviewerLink,
  setFormInstanceSchedulingProgress,
} from '../../../Redux/FormSubmissions/formSubmissions.actions';

// SELECTORS
import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';

// CONSTANTS
import { teCoreSchedulingProgress } from '../../../Constants/teCoreProps.constants';
import { EFormDetailTabs } from '../../../Types/FormDetailTabs.enum';

const EDIT_FORM_INSTANCE = 'EDIT_FORM_INSTANCE';
const SET_PROGRESS_NOT_SCHEDULED = 'SET_PROGRESS_NOT_SCHEDULED';
const SET_PROGRESS_IN_PROGRESS = 'SET_PROGRESS_IN_PROGRESS';
const SET_PROGRESS_SCHEDULED = 'SET_PROGRESS_SCHEDULED';
const SET_ACCEPTANCE_STATUS = 'SET_ACCEPTANCE_STATUS';
const NOTIFY_USER_WITH_REVIEW_LINK = 'NOTIFY_USER_WITH_REVIEW_LINK';
const NOTIFY_ALL_USERS_WITH_REVIEW_LINK = 'NOTIFY_ALL_USERS_WITH_REVIEW_LINK';

const SubmissionActionButton = ({ formInstance }) => {
  const dispatch = useDispatch();
  const selectSubmissions = useMemo(() => makeSelectSubmissions(), []);
  const submissions = useSelector((state) =>
    selectSubmissions(state, formInstance.formId),
  );
  const haveReviewLinkSubmissions = submissions.filter(
    (submission) => submission.reviewLink,
  );
  // State var to hold modal's visibility
  const [isAcceptanceStatusModalOpen, setIsAcceptanceStatusModalOpen] =
    useState(false);

  const onSetFormInstanceSchedulingProgress = async ({
    formInstanceId,
    schedulingProgress,
    formId,
  }) => {
    await dispatch(
      setFormInstanceSchedulingProgress({ formInstanceId, schedulingProgress }),
    );
    // fetch submissions for getting all reviewLink
    dispatch(fetchFormSubmissions(formId));
  };

  const setFormInstanceSchedulingProgressCallback = useCallback(
    (schedulingProgress) => {
      onSetFormInstanceSchedulingProgress({
        formInstanceId: formInstance._id,
        schedulingProgress,
        formId: formInstance.formId,
      });
    },
    [formInstance._id, formInstance.formId, setFormInstanceSchedulingProgress],
  );

  const remindUser = (data) => {
    dispatch(sendReviewerLink(data));
  };

  const onSetFormDetailTab = (tab, submissionId) => {
    dispatch(setFormDetailTab(tab, submissionId));
  };

  const onClick = useCallback(
    ({ key, domEvent }) => {
      domEvent.stopPropagation();

      switch (key) {
        case SET_ACCEPTANCE_STATUS:
          setIsAcceptanceStatusModalOpen(true);
          break;
        case EDIT_FORM_INSTANCE:
          onSetFormDetailTab(EFormDetailTabs.SUBMISSIONS, formInstance._id);
          break;
        case SET_PROGRESS_NOT_SCHEDULED:
          setFormInstanceSchedulingProgressCallback(
            teCoreSchedulingProgress.NOT_SCHEDULED,
          );
          break;
        case SET_PROGRESS_IN_PROGRESS:
          setFormInstanceSchedulingProgressCallback(
            teCoreSchedulingProgress.IN_PROGRESS,
          );
          break;
        case SET_PROGRESS_SCHEDULED:
          setFormInstanceSchedulingProgressCallback(
            teCoreSchedulingProgress.SCHEDULING_FINISHED,
          );
          break;
        case NOTIFY_USER_WITH_REVIEW_LINK:
          remindUser({ formInstanceIds: [formInstance._id] });
          break;
        case NOTIFY_ALL_USERS_WITH_REVIEW_LINK:
          remindUser({
            formInstanceIds: haveReviewLinkSubmissions.map(
              (submission) => submission._id,
            ),
          });
          break;
        default:
          break;
      }
    },
    [
      onSetFormDetailTab,
      formInstance._id,
      setFormInstanceSchedulingProgressCallback,
      remindUser,
      haveReviewLinkSubmissions,
    ],
  );

  const actionMenu = useMemo(
    () => (
      <Menu
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        onClick={onClick}
      >
        <Menu.Item key={EDIT_FORM_INSTANCE}>View</Menu.Item>
        {formInstance.reviewLink && (
          <Menu.Item key={NOTIFY_USER_WITH_REVIEW_LINK}>
            Notify user with review link
          </Menu.Item>
        )}
        {!_.isEmpty(haveReviewLinkSubmissions) && (
          <Menu.Item key={NOTIFY_ALL_USERS_WITH_REVIEW_LINK}>
            Notify all users with review link
          </Menu.Item>
        )}
        <Menu.Item key={SET_ACCEPTANCE_STATUS}>
          Set acceptance status ...
        </Menu.Item>
        <Menu.SubMenu title='Set scheduling progress'>
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
    ),
    [formInstance.reviewLink, haveReviewLinkSubmissions, onClick],
  );

  return (
    <>
      <Dropdown
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        overlay={actionMenu}
        trigger={['click']}
      >
        <Button type='link' size='small' onClick={(e) => e.stopPropagation()}>
          <MoreOutlined />
        </Button>
      </Dropdown>
      <FormInstanceAcceptanceStatusModal
        isVisible={isAcceptanceStatusModalOpen}
        onClose={() => setIsAcceptanceStatusModalOpen(false)}
        formId={formInstance.formId}
        formInstanceId={formInstance._id}
      />
    </>
  );
};

SubmissionActionButton.propTypes = {
  formInstance: PropTypes.object.isRequired,
};

export default withRouter(SubmissionActionButton);
