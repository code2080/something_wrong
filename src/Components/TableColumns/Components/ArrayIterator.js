import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ArrayIterator = ({ arr, arrProp, maxWidth }) => {
  const flatArr = useMemo(
    () =>
      arrProp
        ? (arr || [])
            .filter((value) => value)
            .map((arr) => arr[arrProp] || arr.teExtId)
        : arr,
    [arr, arrProp],
  );
  const renderedArr = useMemo(
    () =>
      flatArr.reduce(
        (text, el, idx) => `${text}${idx > 0 ? ', ' : ''}${el}`,
        '',
      ),
    [flatArr],
  );

  if (!flatArr || flatArr.length === 0) return 'N/A';

  return (
    <Tooltip
      title={renderedArr}
      mouseEnterDelay={0.8}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      {renderedArr}
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
