import React, { useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';

import './Padding.scss';
import { minToHourMinDisplay } from '../../Utils/moment.helpers';

const PaddingDisplay = ({ value }) => {
  const { days, hours, minutes } = useMemo(() => {
    return minToHourMinDisplay(value || 0);
  }, [value]);

  return (
    <span>
      {days && (
        <Fragment>
          {days}d,&nbsp;&nbsp;
        </Fragment>
      )}
      {hours}h {minutes}m
    </span>
  );
}
PaddingDisplay.propTypes = {
  value: PropTypes.number,
}
PaddingDisplay.defaultProps = {
  value: null,
};

const PaddingElement = ({ value }) => {
  if (!value) return null;

  return (
    <div className="element--padding">
      <div>
        <span>Padding before:</span>
        <PaddingDisplay value={value.before} />
      </div>
      <div>
        <span>Padding after:</span>
        <PaddingDisplay value={value.after} />
      </div>
    </div>
  )
};

PaddingElement.propTypes = {
  value: PropTypes.object,
};
PaddingElement.defaultProps = {
  value: null,
};

export default PaddingElement;
