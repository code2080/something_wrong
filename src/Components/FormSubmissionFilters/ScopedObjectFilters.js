import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Input } from 'antd';

// STYLES
import './FormSubmissionFilters.scss';

const PropSearchWrapper = ({ label, value, onChange, }) => (
  <div className="prop-search--wrapper">
    <div className="prop-search--label">{label}</div>
    <Input
      size="small"
      placeholder="Enter filter value..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

PropSearchWrapper.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

PropSearchWrapper.defaultProps = {
  label: '',
  value: '',
};

const mapStateToProps = (state, { objectScope }) => {
  const scopedObjProps = _.get(state, `integration.mappedObjectTypes.${objectScope}`, {});

  return {
    label: scopedObjProps.applicationObjectTypeLabel || null,
    fields: scopedObjProps.fields || [],
  };
};

const ScopedObjectFilters = ({
  label,
  fields,
  scopedObjectFilters,
  onFiltersChange
}) => {
  return (
    <div className="scoped-object-filters--wrapper">
      <div className="scoped-object-filters--header">
        {`Filter scoped object ${label ? `(${label})` : ''}`}
      </div>
      <div className="scoped-object-filters--body">
        {(fields || []).map(field => (
          <PropSearchWrapper
            key={field.fieldExtId}
            label={field.fieldLabel}
            value={scopedObjectFilters[field.fieldExtId]}
            onChange={value => onFiltersChange({ ...scopedObjectFilters, [field.fieldExtId]: value })}
          />
        ))}
      </div>
    </div>
  );
};

ScopedObjectFilters.propTypes = {
  label: PropTypes.string,
  fields: PropTypes.array,
  scopedObjectFilters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
};

ScopedObjectFilters.defaultProps = {
  label: null,
  fields: [],
};

export default connect(mapStateToProps, null)(ScopedObjectFilters);
