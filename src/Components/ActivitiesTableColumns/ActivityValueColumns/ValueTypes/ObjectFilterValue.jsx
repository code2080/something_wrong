import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';

// HELPERS
import { normalizeFilterValues } from '../Helpers/rendering';

// STYLES
import './ObjectFilterValue.scss';
import { useSelector } from 'react-redux';
import { selectMultipleExtIdLabels } from '../../../../Redux/TE/te.selectors';

const ObjectFilterValue = ({ value }) => {
  const [visIdx, setVisIdx] = useState(0);
  const normalizedFilterValues = useMemo(() => normalizeFilterValues(value), [
    value,
  ]);
  const labels = useSelector(selectMultipleExtIdLabels)(
    normalizedFilterValues.map((val) => ({
      field: 'fields',
      extId: val.fieldExtId,
    })),
  );
  const onClickLeft = (e) => {
    e.stopPropagation();
    setVisIdx(Math.max(visIdx - 1, 0));
  };

  const onClickRight = (e) => {
    e.stopPropagation();
    setVisIdx(Math.min(visIdx + 1, normalizedFilterValues.length - 1));
  };

  return (
    <div className='object-filter-value--wrapper'>
      <div className='object-filter-value--toggle'>
        <div className='chevron' onClick={(e) => onClickLeft(e)}>
          <CaretLeftOutlined />
        </div>
        <div className='counter'>{`${visIdx + 1}/${
          normalizedFilterValues.length
        }`}</div>
        <div className='chevron' onClick={(e) => onClickRight(e)}>
          <CaretRightOutlined />
        </div>
      </div>
      <div className='field--wrapper'>
        <div className='two-col--wrapper'>
          <div className='two-col--col'>
            {normalizedFilterValues[visIdx] ? (
              <>
                <div className='title--row'>
                  {labels[normalizedFilterValues[visIdx].fieldExtId]}:
                </div>
                <div className='value--row'>
                  {normalizedFilterValues[visIdx].values}
                </div>
              </>
            ) : (
              <span>N/A</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ObjectFilterValue.propTypes = {
  value: PropTypes.any.isRequired,
};

export default ObjectFilterValue;
