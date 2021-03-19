import React from 'react';
import PropTypes from 'prop-types';

const EllipsisTruncater = ({ children, width }) => (
  <div
    style={{
      // lineHeight: 1.5,
      width: `${width - 16}px`,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
    }}
  >
    {children}
  </div>
);

EllipsisTruncater.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number,
};

EllipsisTruncater.defaultProps = {
  width: 0,
};

export default EllipsisTruncater;
