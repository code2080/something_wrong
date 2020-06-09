import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Input } from 'antd';

// ACTIONS
import { updateFilter } from '../../Redux/Filters/filters.actions';

// SELECTORS
import { selectFilter } from '../../Redux/Filters/filters.selectors';

// STYLES
import './FormSubmissionFilters.scss';

import { FormSubmissionFilterInterface } from '../../Models/FormSubmissionFilter.interface';

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

const mapStateToProps = (state, { objectScope, formId }) => {
  const scopedObjProps = _.get(state, `integration.mappedObjectTypes.${objectScope}`, {});

  return {
    filters: selectFilter(state)(formId, FormSubmissionFilterInterface),
    label: scopedObjProps.applicationObjectTypeLabel || null,
    fields: scopedObjProps.fields || [],
  };
};

const mapActionsToProps = {
  updateFilter,
};

const ScopedObjectFilters = ({
  label,
  fields,
  filters,
  updateFilter,
  formId,
}) => {
  const onUpdateFilter = useCallback((extId, value) => {
    updateFilter({ filterId: formId, key: 'scopedObject', value: { ...filters.scopedObject, [extId]: value } });
  }, [formId, filters, updateFilter]);

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
            value={filters.scopedObject[field.fieldExtId]}
            onChange={value => onUpdateFilter(field.fieldExtId, value)}
          />
        ))}
      </div>
    </div>
  );
};

ScopedObjectFilters.propTypes = {
  label: PropTypes.string,
  fields: PropTypes.array,
  filters: PropTypes.object.isRequired,
  updateFilter: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
};

ScopedObjectFilters.defaultProps = {
  label: null,
  fields: [],
};

export default connect(mapStateToProps, mapActionsToProps)(ScopedObjectFilters);
