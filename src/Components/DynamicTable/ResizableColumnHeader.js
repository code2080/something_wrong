import React from 'react';
import PropTypes from 'prop-types';

const ResizeableColumnHeader = props => {
  const { width, children, ...restProps } = props;
  return (
    <th {...restProps}>
      <div
        style={{
          width: `${width - 16}px`
        }}
      >
        {children}
      </div>
    </th>
  );
};

ResizeableColumnHeader.propTypes = {
  width: PropTypes.number,
  children: PropTypes.node.isRequired,
};

ResizeableColumnHeader.defaultProps = {
  width: 0,
};

export default ResizeableColumnHeader;
