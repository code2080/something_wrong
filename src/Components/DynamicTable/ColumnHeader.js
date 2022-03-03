import { memo } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const ColumnHeader = ({ width, children, className, title }) => {
  if (!title) return children;
  const hasSorter = className.indexOf('sorter') > -1;
  const subtract = hasSorter ? 36 : 16;
  const sorter = _.get(
    children,
    `[${children.length - 1}].props.children.props.children`,
    [],
  );

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
      {hasSorter && (
        <div
          style={{
            display: 'inline-block',
            position: 'absolute',
            top: '0px',
          }}
        >
          {sorter[sorter.length - 1] || null}
        </div>
      )}
    </div>
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

export default memo(ColumnHeader);
