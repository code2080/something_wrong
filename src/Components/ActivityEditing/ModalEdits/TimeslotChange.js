import React from 'react';
import PropTypes from 'prop-types';

// STYLES
import '../ModalEdit.scss';

const ShowInfo = ({
  activityValue,
  activity,
  formatFn,
  prop,
  mappingProps,
}) => {
  return (
    <React.Fragment>
      <span>i am the timeslot change component</span>
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
  formatFn: val => val,
  propTitle: null,
  visible: false,
};

export default ShowInfo;
