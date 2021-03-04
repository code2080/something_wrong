import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// HELPERS
import { normalizeFilterValues } from '../Helpers/rendering';

// ACTIONS
import { setActivityFilterOptions } from '../../../../Redux/Filters/filters.actions';

// STYLES
import './ObjectFilterValue.scss';

// TYPES
import { EActivityFilterType } from '../../../../Types/ActivityFilter.interface';

const ObjectFilterValue = ({ value, extId, activityId }) => {
  const dispatch = useDispatch();
  const { formId } = useParams();
  const [visIdx, setVisIdx] = useState(0);
  const normalizedFilterValues = normalizeFilterValues(value);
  const optionPayloadValues = normalizedFilterValues.reduce((tot, acc) => {
    return {
      ...tot,
      [acc.fieldExtId]: [
        ...(tot[acc.fieldExtId] || []),
        ...(Array.isArray(acc.values) ? acc.values.map(el => ({ label: el, value: `${extId}/${acc.fieldExtId}/${el}` })) : [{ label: acc.values, value: `${extId}/${acc.fieldExtId}/${acc.values}` }]),
      ],
    };
  }, {});
  useEffect(() => {
    dispatch(
      setActivityFilterOptions({
        filterId: `${formId}_ACTIVITIES`,
        optionType: EActivityFilterType.OBJECT_FILTER,
        optionPayload: { extId, values: optionPayloadValues },
        activityId,
      })
    );
  }, []);

  const onClickLeft = e => {
    e.stopPropagation();
    setVisIdx(Math.max(visIdx - 1, 0));
  };

  const onClickRight = e => {
    e.stopPropagation();
    setVisIdx(Math.min(visIdx + 1, normalizedFilterValues.length - 1));
  };

  return (
    <div className='object-filter-value--wrapper'>
      <div className='object-filter-value--toggle'>
        <div
          className='chevron'
          onClick={e => onClickLeft(e)}
        >
          <Icon type='caret-left' />
        </div>
        <div className='counter'>{`${visIdx + 1}/${normalizedFilterValues.length}`}</div>
        <div
          className='chevron'
          onClick={e => onClickRight(e)}
        >
          <Icon type='caret-right' />
        </div>
      </div>
      <div className='field--wrapper'>
        <div className='two-col--wrapper'>
          <div className='two-col--col'>
            <div className='title--row'>{normalizedFilterValues[visIdx].fieldExtId}:</div>
            <div className='value--row'>{normalizedFilterValues[visIdx].values}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

ObjectFilterValue.propTypes = {
  extId: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  activityId: PropTypes.string.isRequired,
};

export default ObjectFilterValue;
