import React from 'react';
import PropTypes from 'prop-types';

// STYLES
import '../ModalEdit.scss';

/* eslint-disable @typescript-eslint/no-unused-vars */
const ShowInfo = ({
  activityValue,
  activity,
  formatFn,
  prop,
  mappingProps,
}) => {
  /* eslint-enable @typescript-eslint/no-unused-vars */
  return (
    <React.Fragment>
      <span>i am the timeslot to exact time component</span>
    </React.Fragment>
  );
};

ShowInfo.propTypes = {
  activityValue: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  formatFn: PropTypes.func,
  mappingProps: PropTypes.object.isRequired,
  prop: PropTypes.string.isRequired,
};

ShowInfo.defaultProps = {
  formatFn: (val) => val,
  propTitle: null,
  visible: false,
};

export default ShowInfo;
