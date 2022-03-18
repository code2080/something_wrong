// COMPONENTS
import { CheckOutlined } from '@ant-design/icons';
import StatusLabel from '../../StatusLabel';

// STYLES
import './index.scss';

// TYPES
import { EActivityStatus, CActivityStatus } from 'Types/Activity/ActivityStatus.enum';

type Props = {
  activityStatus: EActivityStatus[],
};

const StatusText = ({ activityStatus }: { activityStatus: EActivityStatus }) => {
  switch (activityStatus) {
    case EActivityStatus.SCHEDULED:
      return (
        <span>
          <CheckOutlined />
          &nbsp;Scheduled
        </span>
      );
    default:
      return CActivityStatus[activityStatus]?.label ?? activityStatus;
  }
};

const calcFinalActivityStatus = (activityStatus: EActivityStatus[]) => {
  if (!activityStatus || !activityStatus.length) return EActivityStatus.VALIDATION_ERROR;
  if (activityStatus.length === 1) return activityStatus[0];
  return EActivityStatus.GROUPED_MULTIPLE;
}

const SchedulingStatusGrouped = ({ activityStatus }: Props) => {
  const finalActivityStatus = calcFinalActivityStatus(activityStatus);
  return (
    <div className='activity-status-column'>
      <StatusLabel color={CActivityStatus[finalActivityStatus]?.color ?? 'default'}>
        <StatusText activityStatus={finalActivityStatus} />
      </StatusLabel>
    </div>
  );
};

export default SchedulingStatusGrouped;
