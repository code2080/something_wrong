import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

// STYLES
import './IconFormType.scss';

const IconFormType = ({ type }) => {
  if (!type) return null;
  return (
    <Tooltip
      title={`Form type ${type.toLowerCase()}`}
      placement={'right'}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      <span className={`form-type--icon icon--${type}`}>{type[0].toUpperCase()}</span>
    </Tooltip>
  );
};

IconFormType.propTypes = {
  type: PropTypes.string,
};
IconFormType.defaultProps = {
  type: null,
};
export default IconFormType;
