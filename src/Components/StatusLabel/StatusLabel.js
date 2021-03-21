import React from 'react';
import PropTypes from 'prop-types';

// CSS
import './StatusLabel.scss';

const StatusLabel = ({ label, color, className, children, ...rest }) => {
  const statusLabel = (
    <div
      className={`status-label--wrapper ${color} ${className} ${
        typeof rest.onClick === 'function' ? 'clickable' : ''
      }`}
      {...rest}
    >
      {children}
    </div>
  );

  if (label) {
    return (
      <div className='status-label--outer'>
        <span className='status-label--label'>{label}</span>
        {statusLabel}
      </div>
    );
  }
  return statusLabel;
};

StatusLabel.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]),
  className: PropTypes.string,
};

StatusLabel.defaultProps = {
  label: null,
  color: null,
  children: null,
  className: '',
  disabled: false,
};

export default StatusLabel;
