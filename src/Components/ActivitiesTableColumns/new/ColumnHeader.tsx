import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const ColumnHeader = (props) => {
  const { width, children, className, ...restProps } = props;
  const hasSorter = className.indexOf('sorter') > -1;
  const subtract = hasSorter ? 36 : 16;
  const title = hasSorter ? _.get(children, `[${children.length - 1}].props.children.props.children.props.children[0]`, []) : children[1];
  const sorter = _.get(children, `[${children.length - 1}].props.children.props.children.props.children[1]`, []);
  return (
    <th {...restProps}>
      <div
        style={{
          width: `${width - subtract}px`,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'inline-block',
          cursor: hasSorter ? 'pointer' : 'inherit',
        }}
      >
        {title}
      </div>
      {hasSorter && (
        <div
          style={{
            display: 'inline-block',
            position: 'absolute',
            top: '0px',
          }}
        >
          {sorter}
        </div>
      )}
    </th>
  );
};

ColumnHeader.propTypes = {
  width: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

ColumnHeader.defaultProps = {
  width: 0,
  title: null,
  children: null,
  className: '',
};

export default ColumnHeader;
