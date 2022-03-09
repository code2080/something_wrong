import { CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

// COMPONENTS
import ValueDisplay from './FilterValueDisplay';

// TYPES
type Props = {
  label: string;
  filterValues?: [string, string];
  onRemoveFilterProperty: () => void;
  displayFormat: string;
};

const DateValueDisplay = ({
  label,
  filterValues,
  onRemoveFilterProperty,
  displayFormat,
}: Props) => {
  const [start, end] = filterValues ?? [];

  if (!start || !end) return null;

  const renderedString: string = `${
    start ? moment(start).format(displayFormat) : '---'
  } ~ ${end ? moment(end).format(displayFormat) : '---'}`;

  return (
    <ValueDisplay
      label={label}
      content={
        <div>
          {renderedString}
          <CloseCircleOutlined onClick={() => onRemoveFilterProperty()} />
        </div>
      }
    />
  );
};

export default DateValueDisplay;
