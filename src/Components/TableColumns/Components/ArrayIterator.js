/* eslint-disable no-debugger */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

const ArrayIterator = ({ arr, arrProp, maxWidth }) => {
  const flatArr = useMemo(
    () => (arrProp ? (arr || [])
      .filter(value => value)
      .map(arr => arr[arrProp] || arr.teExtId) : arr),
    [arr, arrProp]
  );
  const renderedArr = useMemo(
    () =>
      flatArr.reduce(
        (text, el, idx) => `${text}${idx > 0 ? ', ' : ''}${el}`,
        ''
      ),
    [flatArr]
  );

  if (!flatArr || flatArr.length === 0) return 'N/A';
  return (
    <Tooltip title={renderedArr}>
      <div
        style={{
          width: maxWidth,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {renderedArr}
      </div>
    </Tooltip>
  );
};

ArrayIterator.propTypes = {
  arr: PropTypes.array,
  arrProp: PropTypes.string,
  maxWidth: PropTypes.string,
};

ArrayIterator.defaultProps = {
  arr: [],
  arrProp: null,
  maxWidth: '150px',
};

export default ArrayIterator;
