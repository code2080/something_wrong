import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const ResizeableColumnHeader = props => {
  const { width, children, title, ...restProps } = props;
  const sorter = _.get(children, `[0].props.children.props.children[1]`, null);
  const subtract = sorter.props.children ? 36 : 16;
  return (
    <th {...restProps}>
      <div
        style={{
          width: `${width - subtract}px`,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'inline-block',
        }}
      >
        {title}
      </div>
      {sorter.props.children && (
        <div
          style={{
            display: 'inline-block',
            position: 'absolute',
            top: '3px',
          }}
        >
          {sorter}
        </div>
      )}
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
