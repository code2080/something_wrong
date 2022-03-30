import { useState } from 'react';
import PropTypes from 'prop-types';
import { Popover, Form } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENTS
import EditableText from '../../EditableText/EditableText';
import { CheckOutlined } from '@ant-design/icons';
import StatusLabel from '../../StatusLabel';

// REDUX
import { selectActivityStatus } from 'Redux/DEPR_Activities/activities.selectors';
import { TActivity } from 'Types/Activity/Activity.type';
import { batchOperationStatus } from 'Redux/Activities';

// CONSTANTS
import { DATE_TIME_FORMAT } from 'Constants/common.constants';

// STYLES
import './index.scss';

// TYPES
import { CActivityStatus, EActivityStatus } from 'Types/Activity/ActivityStatus.enum';
import {
  EActivityBatchOperation,
  TActivityBatchOperation,
} from 'Types/Activity/ActivityBatchOperations.type';

type Props = {
  activity: TActivity;
  activityStatus: any;
  onUpdate: (reservationId: string) => void;
};

const PopoverContent = ({ activity, activityStatus, onUpdate }: Props) => {
  const [reservationId, setReservationId] = useState(activity.reservationId);

  const onUpdateReservationId = (reservationId: string) => {
    setReservationId(reservationId);
    onUpdate(reservationId);
  };

  return (
    <div className='activity-col--popover'>
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item label='Status'>
          <StatusLabel
            color={CActivityStatus[activityStatus]?.color ?? 'default'}
          >
            {CActivityStatus[activityStatus]?.label ?? activityStatus}
          </StatusLabel>
        </Form.Item>
        {activityStatus === EActivityStatus.FAILED && (
          <Form.Item label='Error'>
            {`${_.get(activity, 'errorDetails.message', '')} (${_.get(
              activity,
              'errorDetails.code',
              '',
            )})`}
          </Form.Item>
        )}
        <Form.Item label='Time'>
          <div className='ant-form-text'>
            {activity.schedulingTimestamp
              ? moment
                  .utc(activity.schedulingTimestamp)
                  .format(DATE_TIME_FORMAT)
              : 'N/A'}
          </div>
        </Form.Item>
        {activityStatus === EActivityStatus.SCHEDULED && (
          <Form.Item label='ID'>
            <EditableText
              value={reservationId}
              onChange={onUpdateReservationId}
              placeholder='N/A'
            />
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

const StatusText = ({ activity, activityStatus }) => {
  switch (activityStatus) {
    case EActivityStatus.SCHEDULED:
      return (
        <span>
          <CheckOutlined />
          &nbsp;ID:&nbsp;{activity.reservationId || 'N/A'}
        </span>
      );
    default:
      return CActivityStatus[activityStatus]?.label ?? activityStatus;
  }
};

type ActivityStatusColProps = { activity: TActivity };

const ActivityStatusCol = ({ activity }: ActivityStatusColProps) => {
  const { formId } = useParams<{ formId: string }>();
  const activityStatus = useSelector(selectActivityStatus(activity));
  const dispatch = useDispatch();

  const onUpdate = (reservationId: string) => {
    const batchOperation: TActivityBatchOperation = {
      type: EActivityBatchOperation.STATUS,
      data: [
        {
          _id: activity._id,
          activityStatus: EActivityStatus.SCHEDULED,
          reservationId,
        },
      ],
    };

    dispatch(batchOperationStatus(formId, batchOperation));
  };

  return (
    <div className='activity-status-column'>
      <Popover
        title='Scheduling information'
        content={
          <PopoverContent
            activityStatus={activityStatus}
            activity={activity}
            onUpdate={onUpdate}
          />
        }
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
      >
        <StatusLabel
          color={CActivityStatus[activityStatus]?.color ?? 'default'}
        >
          <StatusText activity={activity} activityStatus={activityStatus} />
        </StatusLabel>
      </Popover>
    </div>
  );
};

PopoverContent.propTypes = {
  activity: PropTypes.object.isRequired,
  activityStatus: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
};

StatusText.propTypes = {
  activity: PropTypes.object.isRequired,
  activityStatus: PropTypes.string.isRequired,
};

ActivityStatusCol.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default ActivityStatusCol;
