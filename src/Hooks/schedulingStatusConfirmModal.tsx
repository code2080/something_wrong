import { useDispatch } from 'react-redux';

// COMPONENTS
import { Modal } from 'antd';

// ACTIONS
import { setFormInstanceSchedulingProgress } from '../Redux/FormSubmissions/formSubmissions.actions';

const SchedulingStatusConfirmModal = () => {
  const dispatch = useDispatch();

  const openConfirmModal = (content: any) => {
    const dataSource: { status: string; submissionId: string }[] = [];
    Object.keys(content).forEach((key: string) => {
      if (key && key !== 'null') {
        const submissions = content[key];
        submissions.forEach((submissionId: string) => {
          dataSource.push({
            status: key,
            submissionId,
          });
        });
      }
    });
    if (dataSource.length) {
      Modal.confirm({
        getContainer: () =>
          document.getElementById('te-prefs-lib') || document.body,
        content: 'Do you want to update scheduling status for the submissions?',
        width: 550,
        icon: null,
        onOk: () => {
          dataSource.forEach((item) => {
            dispatch(
              setFormInstanceSchedulingProgress({
                formInstanceId: item.submissionId,
                schedulingProgress: item.status,
              }),
            );
          });
        },
        onCancel: () => {},
        okText: 'Yes',
        cancelText: 'No',
      });
    }
  };
  return {
    openConfirmModal,
  };
};

export default SchedulingStatusConfirmModal;
