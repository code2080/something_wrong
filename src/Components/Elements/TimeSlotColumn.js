import { useMemo } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

// HELPERS
import { findTimeSlot } from '../../Utils/sections.helpers';

// STYLES
import './Pickers.scss';
import { TIME_FORMAT } from '../../Constants/common.constants';

const TimeSlotColumn = ({ event, timeslots }) => {
  const timeslot = useMemo(
    () => findTimeSlot(event.startTime, event.endTime, timeslots),
    [event, timeslots],
  );
  const tooltipTitle = useMemo(() => {
    if (timeslot) {
      return `Timeslot ${timeslot.label}: ${moment(timeslot.startTime).format(
        TIME_FORMAT,
      )} - ${moment(timeslot.endTime).format(TIME_FORMAT)}`;
    }
    return 'Timeslot could not be found';
  }, [timeslot]);

  return (
    <Tooltip
      title={tooltipTitle}
      mouseEnterDelay={0.8}
      placement='topLeft'
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      <div className='picker--wrapper'>
        <div className='icon--wrapper'>
          <ClockCircleOutlined />
        </div>
        <div className='value--wrapper'>
          {timeslot ? timeslot.label : 'N/A'}
        </div>
      </div>
    </Tooltip>
  );
};

TimeSlotColumn.propTypes = {
  event: PropTypes.object.isRequired,
  timeslots: PropTypes.array.isRequired,
};

export default TimeSlotColumn;
