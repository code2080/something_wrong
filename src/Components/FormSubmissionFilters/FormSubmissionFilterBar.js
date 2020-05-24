import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Button } from 'antd';

// STYLES
import './FormSubmissionFilters.scss';

const FormSubmissionFilterBar = ({
  freeTextFilter,
  onFreeTextFilterChange,
  isPropsFilterVisible,
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
      <Button
        className={isPropsFilterVisible ? 'active' : ''}
        type="link"
        size="small"
        shape="circle"
        onClick={togglePropsFilter}
      >
        <Icon type="filter" theme="filled" />
      </Button>
    </div>
  );
};

FormSubmissionFilterBar.propTypes = {
  freeTextFilter: PropTypes.string.isRequired,
  onFreeTextFilterChange: PropTypes.func.isRequired,
  togglePropsFilter: PropTypes.func.isRequired,
  isPropsFilterVisible: PropTypes.bool.isRequired,
};

export default FormSubmissionFilterBar;
