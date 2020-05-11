import React from 'react';
import PropTypes from 'prop-types';

const EllipsisTruncater = ({ children, width }) => (
  <div
    style={{
      width: `${width - 16}px`,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}
  >
    {children}
  </div>
);

EllipsisTruncater.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number
};

EllipsisTruncater.defaultProps = {
  width: 0
};

export default EllipsisTruncater;
