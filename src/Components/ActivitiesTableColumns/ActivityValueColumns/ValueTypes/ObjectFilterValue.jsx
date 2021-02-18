import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

// HELPERS
import { normalizeFilterValues } from '../Helpers/rendering';

// STYLES
import './ObjectFilterValue.scss';

const ObjectFilterValue = ({ value }) => {
  const [visIdx, setVisIdx] = useState(0);
  const normalizedFilterValues = normalizeFilterValues(value);
  // console.log(normalizedFilterValues);

  const onClickLeft = e => {
    e.stopPropagation();
    setVisIdx(Math.max(visIdx - 1, 0));
  };

  const onClickRight = e => {
    e.stopPropagation();
    setVisIdx(Math.min(visIdx + 1, normalizedFilterValues.length - 1))
  }

  return (
    <div className="object-filter-value--wrapper">
      <div className="object-filter-value--toggle">
        <div
          className="chevron"
          onClick={e => onClickLeft(e)}
        >
          <Icon type="caret-left" />
        </div>
        <div className="counter">{`${visIdx + 1}/${normalizedFilterValues.length}`}</div>
        <div
          className="chevron"
          onClick={e => onClickRight(e)}
        >
          <Icon type="caret-right" />
        </div>
      </div>
      <div className="field--wrapper">
        <div className="two-col--wrapper">
          <div className="two-col--col">
            <div className="title--row">{normalizedFilterValues[visIdx].fieldExtId}:</div>
            <div className="value--row">{normalizedFilterValues[visIdx].values}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

ObjectFilterValue.propTypes = {
  value: PropTypes.any.isRequired,
};

export default ObjectFilterValue;
