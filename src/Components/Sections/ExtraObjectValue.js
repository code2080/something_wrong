import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// HELPERS
import { getPayloadForExtraObject } from '../../Utils/forms.helpers';

// STYLES
import './ExtraObjectValue.scss';

// CONSTANTS
import { datasourceValueTypes } from '../../Constants/datasource.constants';

const mapStateToProps = (state, { formId, formInstanceId, extraObject }) => {
  const form = state.forms[formId];
  const formInstance = state.submissions[formId][formInstanceId];
  const payload = getPayloadForExtraObject({ extraObject, form, formInstance });
  const typeObj = (payload || []).find(el => el.valueType === datasourceValueTypes.TYPE_EXTID);
  const typeExtId = typeObj ? typeObj.extId : null;
  const valueObj = (payload || []).find(el => el.valueType === datasourceValueTypes.OBJECT_EXTID);
  const valueExtId = valueObj ? valueObj.extId : null;
  return {
    typeExtId,
    typeLabel: typeExtId && state.te.extIdProps.types[typeExtId]
      ? state.te.extIdProps.types[typeExtId].label
      : null,
    valueExtId,
    valueLabel: valueExtId && state.te.extIdProps.objects[valueExtId]
      ? state.te.extIdProps.objects[valueExtId].label
      : null,
  };
}

const ExtraObjectValue = ({ typeExtId, typeLabel, valueLabel, valueExtId }) => {
  return (
    <div className="extra-object--value">
      <span>Type: <strong>{typeLabel || typeExtId || 'N/A'}</strong></span>
      <span>Value: <strong>{valueLabel || valueExtId || 'N/A'}</strong></span>
    </div>
  );
};

ExtraObjectValue.propTypes = {
  typeLabel: PropTypes.string,
  typeExtId: PropTypes.string,
  valueLabel: PropTypes.string,
  valueExtId: PropTypes.string,
};

ExtraObjectValue.defaultProps = {
  typeExtId: null,
  typeLabel: null,
  valueExtId: null,
  valueLabel: null,
};

export default connect(mapStateToProps, null)(ExtraObjectValue);
