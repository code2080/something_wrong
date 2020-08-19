import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { datasourceValueTypes } from '../../Constants/datasource.constants';

// CONSTANTS
const renderFieldValues = values => (values || []).reduce((text, val, idx) => `${text}${idx > 0 ? ', ' : ''}${val}`, '');

const DatasourceEmptyInner = () => (
  <div className="element__datasource--inner">
    N/A
  </div>
);

const DatasourceInner = ({ elType, labels, payload }) => {
  if (elType === 'OBJECT') return <DatasourceObjectInner labels={labels} />;
  if (elType === 'FILTER') return <DatasourceFilterInner labels={labels} payload={payload} />;
  return null;
};

DatasourceInner.propTypes = {
  elType: PropTypes.string.isRequired,
  labels: PropTypes.object,
  payload: PropTypes.array,
};

DatasourceInner.defaultProps = {
  labels: {},
  payload: [],
};

const DatasourceFilterInner = ({ labels, payload }) => {
  const [visIdx, setVisIdx] = useState(0);
  const labelArr = useMemo(() => Object.keys(labels).map(key => labels[key]), [labels]);
  const displayValue = useMemo(() => {
    const numberedKey = Object.keys(labels)[visIdx];
    const value = payload.find(el => el.valueType === datasourceValueTypes.FIELD_VALUE && el.extId === numberedKey);
    if (!value || !value.value) return 'N/A';
    return renderFieldValues(value.value);
  }, [visIdx]);

  return (
    <div className="element__datasource--inner">
      <div className="field--wrapper">
        <div
          className="chevron"
          onClick={() => setVisIdx(Math.max(visIdx - 1, 0))}
        >
          <Icon type="caret-left" />
        </div>
        <div className="counter">{`${visIdx + 1}/${labelArr.length}`}</div>
        <div
          className="chevron"
          onClick={() => setVisIdx(Math.min(visIdx + 1, labelArr.length - 1))}
        >
          <Icon type="caret-right" />
        </div>
        <div className="field--label">{labelArr[visIdx]}:</div>
        <div className="field--value">
          {displayValue}
        </div>
      </div>
      <Icon type="down" />
    </div>
  )
};

DatasourceFilterInner.propTypes = {
  labels: PropTypes.object,
  payload: PropTypes.array,
};

DatasourceFilterInner.defaultProps = {
  labels: {},
  payload: [],
};

const DatasourceObjectInner = ({ labels }) => {
  return (
    <div className="element__datasource--inner">
      {Object.keys(labels).reduce((text, key, idx) => `${text}${idx > 0 ? ', ' : ''}${labels[key]}`, '')}
      <Icon type="down" />
    </div>
  )
};

DatasourceObjectInner.propTypes = {
  labels: PropTypes.object,
};

DatasourceFilterInner.defaultProps = {
  labels: {},
};

export {
  DatasourceInner,
  DatasourceEmptyInner,
};
