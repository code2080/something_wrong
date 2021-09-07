import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { datasourceValueTypes } from '../../../Constants/datasource.constants';

// CONSTANTS
const renderFieldValues = (values) =>
  (values || []).reduce(
    (text, val, idx) => `${text}${idx > 0 ? ', ' : ''}${val}`,
    '',
  );

const DatasourceFilterInner = ({ labels, payload, menu }) => {
  const [visIdx, setVisIdx] = useState(0);
  const labelArr = useMemo(
    () => Object.keys(labels).map((key) => labels[key]),
    [labels],
  );
  const displayValue = useMemo(() => {
    const numberedKey = Object.keys(labels)[visIdx];
    const value = payload.find(
      (el) =>
        el.valueType === datasourceValueTypes.FIELD_VALUE &&
        el.extId === numberedKey,
    );
    if (!value || !value.value) return 'N/A';
    return renderFieldValues(value.value);
  }, [labels, payload, visIdx]);

  return (
    <Dropdown
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      overlay={menu}
    >
      <div className='element__datasource--inner'>
        <div className='field--wrapper'>
          <div
            className='chevron'
            onClick={(e) => {
              e.stopPropagation();
              setVisIdx(Math.max(visIdx - 1, 0));
            }}
          >
            <CaretLeftOutlined />
          </div>
          <div className='counter'>{`${visIdx + 1}/${labelArr.length}`}</div>
          <div
            className='chevron'
            onClick={(e) => {
              e.stopPropagation();
              setVisIdx(Math.min(visIdx + 1, labelArr.length - 1));
            }}
          >
            <CaretRightOutlined />
          </div>
          <div className='field--label'>{labelArr[visIdx]}:</div>
          <div className='field--value'>{displayValue}</div>
        </div>
        <DownOutlined />
      </div>
    </Dropdown>
  );
};

DatasourceFilterInner.propTypes = {
  labels: PropTypes.object,
  payload: PropTypes.array,
  menu: PropTypes.object.isRequired,
};

DatasourceFilterInner.defaultProps = {
  labels: {},
  payload: [],
};

export default DatasourceFilterInner;
