import React from 'react';
import PropTypes from 'prop-types';

import { Modal as AntModal, Form, Select } from 'antd';
import { teCoreSchedulingProgressProps } from '../../Constants/teCoreProps.constants';
import { useDispatch, useSelector } from 'react-redux';
import { setFormInstanceSchedulingProgress } from '../../Redux/FormSubmissions/formSubmissions.actions';

import { createLoadingSelector } from '../../Redux/APIStatus/apiStatus.selectors';

const FormInstanceSchedulingStatusProcess = ({ visible, onClose, form, schedulingProgress, formInstanceId }) => {
  const dispatch = useDispatch();
  const { getFieldDecorator, validateFields } = form;
  const saving = useSelector(createLoadingSelector(['SET_SCHEDULING_PROGRESS']));
  const onSubmit = () => {
    validateFields(async (err, values) => {
      if (!err) {
        await dispatch(
          setFormInstanceSchedulingProgress({ formInstanceId, schedulingProgress: values.schedulingProgress })
        );
        onClose();
      }
    });
  };

  return (
    <AntModal
      getContainer={() => document.getElementById('te-prefs-lib')}
      visible={visible}
      onCancel={onClose}
      onOk={onSubmit}
      okButtonProps={{
        loading: saving,
      }}
      destroyOnClose
    >
      <Form.Item label='Set scheduling process'>
        {getFieldDecorator('schedulingProgress', {
          rules: [
            {
              required: 'Scheduling process is required'
            },
          ],
          initialValue: schedulingProgress,
        })(
          <Select
            getPopupContainer={() =>
              document.querySelector('#te-prefs-lib .ant-modal-content')
            }
            style={{ width: '100%' }}
          >
            {Object.values(teCoreSchedulingProgressProps).map(item => (
              <Select.Option key={item.key} value={item.key}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </AntModal>
  );
};

FormInstanceSchedulingStatusProcess.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  schedulingProgress: PropTypes.string,
  formInstanceId: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
};

export default Form.create()(FormInstanceSchedulingStatusProcess);
