import { useMemo } from 'react';
import PropTypes from 'prop-types';

import './Padding.scss';
import { minToHourMinDisplay } from '../../Utils/moment.helpers';

const PaddingDisplay = ({ value, settings }) => {
  const { days, hours, minutes } = useMemo(() => {
    return minToHourMinDisplay(value || 0);
  }, [value]);

  return (
    <span>
      {settings.allowDayPadding && Number(days) ? (
        <>{days}d,&nbsp;&nbsp;</>
      ) : null}
      {hours}h{settings.allowMinutePadding && <>&nbsp;{minutes}m</>}
    </span>
  );
};
PaddingDisplay.propTypes = {
  value: PropTypes.number,
  settings: PropTypes.object,
};
PaddingDisplay.defaultProps = {
  value: null,
  settings: {},
};

const PaddingElement = ({ value, element }) => {
  if (!value || !element) return null;

  const { settings } = element;

  return (
    <div className='element--padding'>
      {settings && settings.allowPaddingBefore && (
        <div>
          <span>Padding before:</span>
          <PaddingDisplay value={value.before} settings={settings} />
        </div>
      )}
      {settings && settings.allowPaddingAfter && (
        <div>
          <span>Padding after:</span>
          <PaddingDisplay value={value.after} settings={settings} />
        </div>
      )}
    </div>
  );
};

PaddingElement.propTypes = {
  value: PropTypes.object,
  element: PropTypes.object.isRequired,
};
PaddingElement.defaultProps = {
  value: null,
};

export default PaddingElement;
