import { useState } from 'react';
import PropTypes from 'prop-types';

import { Modal as AntModal, Select, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { teCoreSchedulingProgressProps } from '../../Constants/teCoreProps.constants';
import { setFormInstanceSchedulingProgress } from '../../Redux/FormSubmissions/formSubmissions.actions';
import { createLoadingSelector } from '../../Redux/APIStatus/apiStatus.selectors';

const FormInstanceSchedulingStatusProcess = ({
  visible,
  onClose,
  schedulingProgress: defaultSchedulingProgress,
  formInstanceId,
}) => {
  const dispatch = useDispatch();
  const saving = useSelector(
    createLoadingSelector(['SET_SCHEDULING_PROGRESS']),
  );

  /**
   * STATE
   */
  const [schedulingProgress, setSchedulingProgress] = useState(
    defaultSchedulingProgress,
  );
  /**
   * EVENT HANDLERS
   */
  const onSubmit = () => {
    dispatch(
      setFormInstanceSchedulingProgress({ formInstanceId, schedulingProgress }),
    );
    onClose();
  };

  return (
    <AntModal
      getContainer={() => document.getElementById('te-prefs-lib')}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      visible={visible}
      onCancel={onClose}
      onOk={onSubmit}
      okButtonProps={{
        loading: saving,
      }}
      destroyOnClose
      title='Set scheduling process'
    >
      <Form.Item label='Set scheduling process'>
        <Select
          getPopupContainer={() =>
            document.querySelector('#te-prefs-lib .ant-modal-content')
          }
          style={{ width: '100%' }}
          value={schedulingProgress}
          onChange={(val) => setSchedulingProgress(val)}
        >
          {Object.values(teCoreSchedulingProgressProps).map((item) => (
            <Select.Option key={item.key} value={item.key}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </AntModal>
  );
};

FormInstanceSchedulingStatusProcess.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  schedulingProgress: PropTypes.string,
  formInstanceId: PropTypes.string.isRequired,
};

export default FormInstanceSchedulingStatusProcess;
