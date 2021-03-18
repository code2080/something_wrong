import React from 'react';
import PropTypes from 'prop-types';

const EllipsisRenderer = ({ text, width }) => (
  <div
    alt={text}
    title={text}
    style={{
      width: `${width}px`,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      background: 'transparent',
      position: 'relative',
      zIndex: 2,
    }}
  >
    <span style={{ background: 'rgba(255, 255, 255, 0.75)' }}>{text}</span>
  </div>
);

EllipsisRenderer.propTypes = {
  text: PropTypes.string,
  width: PropTypes.number,
};

EllipsisRenderer.defaultProps = {
  text: '',
  width: 150,
};

export default EllipsisRenderer;
