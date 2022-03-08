import { CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

// COMPONENTS
import ValueDisplay from './FilterValueDisplay';

// CONSTANTS
import { DATE_FORMAT } from 'Constants/common.constants';

// TYPES
type Props = {
  dateFilterValues?: [string, string];
  onRemoveFilterProperty: (filterProperties: string[]) => void;
};

const DateValueDisplay = ({
  dateFilterValues,
  onRemoveFilterProperty,
}: Props) => {
  if (!dateFilterValues || (!dateFilterValues[0] && !dateFilterValues[1]))
    return null;
  const dateDisplay: string = `${
    dateFilterValues[0]
      ? moment(dateFilterValues[0]).format(DATE_FORMAT)
      : '---'
  } ~ ${
    dateFilterValues[1]
      ? moment(dateFilterValues[1]).format(DATE_FORMAT)
      : '---'
  }`;

  return (
    <ValueDisplay
      label='Date interval'
      content={
        <div>
          {dateDisplay}
          <CloseCircleOutlined
            onClick={() => onRemoveFilterProperty(['time'])}
          />
        </div>
      }
    />
  );
};

export default DateValueDisplay;
