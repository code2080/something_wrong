import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Button } from 'antd';

// STYLES
import './FormSubmissionFilters.scss';

const FormSubmissionFilterBar = ({
  freeTextFilter,
  onFreeTextFilterChange,
  togglePropsFilter,
}) => {
  return (
    <div className="form-submission-filter-bar--wrapper">
      <Input
        placeholder="Filter..."
        value={freeTextFilter}
        onChange={e => onFreeTextFilterChange(e.target.value)}
        suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
        size="small"
      />
      <Button type="link" size="small" onClick={togglePropsFilter}>
        <Icon type="filter" />
      </Button>
    </div>
  );
};

FormSubmissionFilterBar.propTypes = {
  freeTextFilter: PropTypes.string.isRequired,
  onFreeTextFilterChange: PropTypes.func.isRequired,
  togglePropsFilter: PropTypes.func.isRequired,
};

export default FormSubmissionFilterBar;
