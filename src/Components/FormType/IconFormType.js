import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
// STYLES
import './IconFormType.scss';

const IconFormType = ({ type }) => {
  if (!type) return null;
  return <span className={`form-type--icon icon--${type}`}>{type[0].toUpperCase()}</span>;
};

IconFormType.propTypes = {
  type: PropTypes.string,
};
IconFormType.defaultProps = {
  type: null,
};
export default IconFormType;
