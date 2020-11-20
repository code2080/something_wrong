import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const ColumnHeader = props => {
  const { width, children, title, ...restProps } = props;
  if (!title) return children;

  const sorter = _.get(children, `[0].props.children.props.children[1]`, null);
  const subtract = sorter.props.children ? 36 : 16;
  return (
    <div>
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
    </div>
  );
};

ColumnHeader.propTypes = {
  width: PropTypes.number,
  children: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

ColumnHeader.defaultProps = {
  width: 0,
  title: null,
  children: null,
};

export default ColumnHeader;
