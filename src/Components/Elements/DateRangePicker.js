import PropTypes from 'prop-types';
import moment from 'moment';
import { CalendarOutlined } from '@ant-design/icons';
import { DATE_FORMAT } from '../../Constants/common.constants';

// STYLES
import './Pickers.scss';

const DatePicker = ({ value }) => (
  <div className='picker--wrapper'>
    <div className='icon--wrapper'>
      <CalendarOutlined />
    </div>
    <div className='value--wrapper'>
      {!value || !value[0] || !value[1]
        ? 'N/A'
        : `${moment(value[0]).format(DATE_FORMAT)} - ${moment(value[1]).format(
            DATE_FORMAT,
          )}`}
    </div>
  </div>
);

DatePicker.propTypes = {
  value: PropTypes.array,
};

DatePicker.defaultProps = {
  value: null,
};

export default DatePicker;
