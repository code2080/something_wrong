import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get, keyBy } from 'lodash';

// COMPONENTS
import { Modal, Table } from 'antd';
import StatusLabel from '../Components/StatusLabel/StatusLabel';

// ACTIONS
import { setFormInstanceSchedulingProgress } from '../Redux/FormSubmissions/formSubmissions.actions';

// SELECTORS
import { selectSubmissions } from '../Redux/FormSubmissions/formSubmissions.selectors';

// CONSTANTS
import { teCoreSchedulingProgressProps } from '../Constants/teCoreProps.constants';

type Props = {
  formId: string;
};

const SchedulingStatusConfirmModal = ({ formId }: Props) => {
  const dispatch = useDispatch();
  const formInstances = useSelector(selectSubmissions)(formId);
  const indexedFormInstances = useMemo(() => keyBy(formInstances, '_id'), [
    formInstances,
  ]);

  const columns = [
    {
      title: 'Submission',
      key: 'name',
      dataIndex: 'submissionId',
      render: (submissionId: string) => {
        return get(indexedFormInstances, [submissionId, 'submitter'], '');
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: string, item) => {
        if (
          !teCoreSchedulingProgressProps[status] ||
          !indexedFormInstances[item.submissionId]
        )
          return null;
        const oldStatus = get(
          indexedFormInstances[item.submissionId],
          'teCoreProps.schedulingProgress',
        );
        return (
          <div>
            <StatusLabel
              color={teCoreSchedulingProgressProps[oldStatus]?.color}
              className='no-margin'
            >
              {teCoreSchedulingProgressProps[oldStatus]?.label}
            </StatusLabel>
            <span>--&gt;</span>
            <StatusLabel
              color={teCoreSchedulingProgressProps[status].color}
              className='no-margin'
            >
              {teCoreSchedulingProgressProps[status].label}
            </StatusLabel>
          </div>
        );
      },
    },
  ];
  const renderTable = (dataSource: any) => {
    return (
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    );
  };
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
        title: 'Do you want to update the scheduling progress?',
        content: renderTable(dataSource),
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
      });
    }
  };
  return {
    openConfirmModal,
  };
};

export default SchedulingStatusConfirmModal;
