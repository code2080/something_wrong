import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash'
import PropTypes from 'prop-types';
import { Dropdown, Icon } from 'antd';
import { datasourceValueTypes } from '../../Constants/datasource.constants';

import { objectRequestTypeToText } from '../../Constants/ObjectRequest.constants';
import { selectObjectRequestsByValues } from '../../Redux/ObjectRequests/ObjectRequests.selectors'

// CONSTANTS
const renderFieldValues = values => (values || []).reduce((text, val, idx) => `${text}${idx > 0 ? ', ' : ''}${val}`, '');

const DatasourceEmptyInner = () => (
  <div className="element__datasource--inner">
    N/A
  </div>
);

export const DatasourceInner = ({ elType, labels, payload, menu }) => {
  if (elType === 'EMPTY')  return <DatasourceEmptyInner/>
  if (elType === 'OBJECT') return <DatasourceObjectInner labels={_.flatMap(labels)} menu={menu}/>
  if (elType === 'FILTER') return <DatasourceFilterInner labels={labels} payload={payload} menu={menu} />
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

const DatasourceFilterInner = ({ labels, payload, menu }) => {
  const [visIdx, setVisIdx] = useState(0);
  const labelArr = useMemo(() => Object.keys(labels).map(key => labels[key]), [labels]);
  const displayValue = useMemo(() => {
    const numberedKey = Object.keys(labels)[visIdx];
    const value = payload.find(el => el.valueType === datasourceValueTypes.FIELD_VALUE && el.extId === numberedKey);
    if (!value || !value.value) return 'N/A';
    return renderFieldValues(value.value);
  }, [visIdx]);

  return (
    <Dropdown
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      overlay={menu}
    >
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
    </Dropdown>
  )
};

DatasourceFilterInner.propTypes = {
  labels: PropTypes.object,
  payload: PropTypes.array,
  menu: PropTypes.object.isRequired
};

DatasourceFilterInner.defaultProps = {
  labels: {},
  payload: [],
};

const ObjectRequestStatus = status => <Icon type="question" style={{ color: 'rgba(255,0,0, 0.8)' }} />

const ObjectRequestValue = ({ request }) => <React.Fragment>
  <ObjectRequestStatus status='shouldBeRequest.status' />
  <span>{request.objectExtId}</span>
  <span>{objectRequestTypeToText[request.type]}</span>
</React.Fragment>


const DatasourceObjectInner = ({ labels, menu }) => {
  const foundObjReqs = useSelector(selectObjectRequestsByValues(labels));
  return labels.map(label => {
    const objReq = foundObjReqs.find(req => req._id === label);
    return <Dropdown
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      overlay={menu}
      key={label}
    >
      <div className="dd-trigger element__datasource--inner">
        {objReq ? <ObjectRequestValue request={objReq} /> : label || 'N/A'}
        <Icon type="down" />
      </div>
    </Dropdown>
  })
};

DatasourceObjectInner.propTypes = {
  labels: PropTypes.array,
  menu: PropTypes.object.isRequired
};

DatasourceFilterInner.defaultProps = {
  labels: [],
};
