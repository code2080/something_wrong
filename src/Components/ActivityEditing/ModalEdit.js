import PropTypes from 'prop-types';
import { Modal } from 'antd';

// COMPONENTS
import ShowInfo from './ModalEdits/ShowInfo';
import TimeslotToExactTime from './ModalEdits/TimeslotToExactTime';

// STYLES
import './ModalEdit.scss';

// CONSTANTS
import { activityActions } from '../../Constants/activityActions.constants';

const componentMapping = {
  [activityActions.TIMESLOT_TO_EXACT_OVERRIDE]: TimeslotToExactTime,
  [activityActions.SHOW_INFO]: ShowInfo,
};

const ModalEdit = ({
  action,
  activityValue,
  activity,
  formatFn,
  prop,
  propTitle,
  mappingProps,
  visible,
  onClose,
}) => {
  const ModalComponent = componentMapping[action];
  if (!ModalComponent || ModalComponent == null) return null;

  const title =
    action === activityActions.SHOW_INFO
      ? `Details for '${propTitle || prop}'`
      : `Edit '${propTitle || prop}'`;
  return (
    <Modal
      title={title}
      visible={visible}
      getContainer={() => document.getElementById('te-prefs-lib')}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      closable
      footer={null}
      maskClosable
      onCancel={onClose}
      onOk={onClose}
    >
      <div className='modal-edit--wrapper'>
        <ModalComponent
          activityValue={activityValue}
          activity={activity}
          formatFn={formatFn}
          mappingProps={mappingProps}
          prop={prop}
        />
      </div>
    </Modal>
  );
};

ModalEdit.propTypes = {
  action: PropTypes.string,
  activityValue: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  formatFn: PropTypes.func,
  mappingProps: PropTypes.object.isRequired,
  prop: PropTypes.string.isRequired,
  propTitle: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

ModalEdit.defaultProps = {
  action: null,
  formatFn: (val) => val,
  propTitle: null,
  visible: false,
};

export default ModalEdit;
