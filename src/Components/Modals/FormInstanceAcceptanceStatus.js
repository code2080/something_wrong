import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form, Input, Select } from 'antd';

// ACTIONS
import { setFormInstanceAcceptanceStatus } from '../../Redux/FormSubmissions/formSubmissions.actions';

// CONSTANTS
import { teCoreAcceptanceStatusProps } from '../../Constants/teCoreProps.constants';

const mapStateToProps = (state, ownProps) => {
  const { formId, formInstanceId } = ownProps;
  if (
    !formId ||
    !formInstanceId ||
    !state.submissions[formId] ||
    !state.submissions[formId][formInstanceId]
  )
    return {};
  const {
    acceptanceComment: _acceptanceComment,
    acceptanceStatus: _acceptanceStatus
  } = state.submissions[formId][formInstanceId].teCoreProps || {};

  return {
    _acceptanceStatus,
    _acceptanceComment
  };
};

const mapActionsToProps = {
  setFormInstanceAcceptanceStatus
};

const FormInstanceAcceptanceStatus = ({
  _acceptanceStatus,
  _acceptanceComment,
  formInstanceId,
  isVisible,
  onClose,
  setFormInstanceAcceptanceStatus
}) => {
  // State vars to hold acceptance status, comment
  const [acceptanceStatus, setAcceptanceStatus] = useState(null);
  const [acceptanceComment, setAcceptanceComment] = useState(null);

  // Effect to update acceptance status if original changes
  useEffect(() => {
    setAcceptanceStatus(_acceptanceStatus);
  }, [_acceptanceStatus]);
  // Effect to update acceptance comment if original changes
  useEffect(() => {
    setAcceptanceComment(_acceptanceComment);
  }, [_acceptanceStatus]);

  // Callback to submit acceptance status
  const onSubmitAcceptanceStatusCallback = useCallback(() => {
    setFormInstanceAcceptanceStatus({
      formInstanceId,
      acceptanceStatus,
      acceptanceComment
    });
    onClose();
  }, [
    acceptanceStatus,
    acceptanceComment,
    setFormInstanceAcceptanceStatus,
    onClose
  ]);

  return (
    <Modal
      title="Set acceptance status"
      destroyOnClose={true}
      visible={isVisible}
      onOk={onSubmitAcceptanceStatusCallback}
      onCancel={onClose}
      getContainer={() => document.getElementById('te-prefs-lib')}
      id="acceptanceStatusModal"
      destroyOnClose
    >
      <Form.Item label="Set acceptance status">
        <Select
          getPopupContainer={() =>
            document.querySelector('#te-prefs-lib .ant-modal-content')
          }
          value={acceptanceStatus}
          onChange={val => setAcceptanceStatus(val)}
          style={{ width: '100%' }}
        >
          {Object.keys(teCoreAcceptanceStatusProps).map(key => (
            <Select.Option key={key} value={key}>
              {teCoreAcceptanceStatusProps[key].label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="(Optional) Comment">
        <Input
          placeholder="Comment"
          value={acceptanceComment}
          onChange={e => setAcceptanceComment(e.target.value)}
        />
      </Form.Item>
    </Modal>
  );
};

FormInstanceAcceptanceStatus.propTypes = {
  _acceptanceStatus: PropTypes.string,
  _acceptanceComment: PropTypes.string,
  formInstanceId: PropTypes.string.isRequired,
  isVisible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  setFormInstanceAcceptanceStatus: PropTypes.func.isRequired
};

FormInstanceAcceptanceStatus.defaultProps = {
  _acceptanceStatus: null,
  _acceptanceComment: null,
  isVisible: false
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(FormInstanceAcceptanceStatus);
