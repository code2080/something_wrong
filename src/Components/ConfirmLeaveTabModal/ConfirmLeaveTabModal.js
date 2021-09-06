import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';

const ConfirmLeaveTabModal = ({
  isOpen = false,
  handleCancel,
  handleSave,
  handleLeave,
}) => {
  return (
    <Modal
      title='Confirm leaving'
      visible={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key='leave' type='primary' onClick={handleLeave}>
          Leave anyway
        </Button>,
        <Button key='save' type='primary' onClick={handleSave}>
          Save
        </Button>,
        <Button key='cancel' onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <p>
        There are unsaved changes in your activity design. Do you want to save
        before you leave?
      </p>
    </Modal>
  );
};

ConfirmLeaveTabModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleLeave: PropTypes.func.isRequired,
};

export default ConfirmLeaveTabModal;
