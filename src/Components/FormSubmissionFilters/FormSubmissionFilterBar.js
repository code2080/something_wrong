import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Button, Switch } from 'antd';
import { SearchOutlined, FilterFilled } from '@ant-design/icons';

// ACTIONS
import { updateFilter } from '../../Redux/Filters/filters.actions';

// SELECTORS
import { selectFilter } from '../../Redux/Filters/filters.selectors';

// STYLES
import './FormSubmissionFilters.scss';

// CONSTANTS
import { FormSubmissionFilterInterface } from '../../Models/FormSubmissionFilter.interface';

const mapStateToProps = (state, { formId }) => ({
  filters: selectFilter(state)(`${formId}_SUBMISSIONS`, FormSubmissionFilterInterface),
});

const mapActionsToProps = {
  updateFilter,
};

const FormSubmissionFilterBar = ({
  formId,
  filters,
  updateFilter,
  isPropsFilterVisible,
  togglePropsFilter,
}) => {
  const onUpdateFilter = useCallback((key, value) => {
    updateFilter({ filterId: `${formId}_SUBMISSIONS`, key, value });
  }, [formId, updateFilter]);

  const filterIconClass = useMemo(() => {
    if (isPropsFilterVisible) return 'active';
    if ((Object.keys(filters.scopedObject) || []).some(key => filters.scopedObject[key] && filters.scopedObject[key].length > 0)) { return 'has-filters'; }
  }, [filters, isPropsFilterVisible]);

  return (
    <div className='form-submission-filter-bar--wrapper'>
      <Input
        placeholder='Filter...'
        value={filters.freeTextFilter}
        onChange={e => onUpdateFilter('freeTextFilter', e.target.value)}
        suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
        size='small'
      />
      <div className='form-submission-filter-bar--switch'>
        <Switch
          checked={filters.onlyOwn}
          onChange={onlyOwn => onUpdateFilter('onlyOwn', onlyOwn)}
          size='small'
        />
        <span>Show only own</span>
      </div>
      <Button
        className={filterIconClass}
        type='link'
        size='small'
        shape='circle'
        onClick={togglePropsFilter}
      >
        <FilterFilled />
      </Button>
    </div>
  );
};

FormSubmissionFilterBar.propTypes = {
  formId: PropTypes.string.isRequired,
  filters: PropTypes.object,
  updateFilter: PropTypes.func.isRequired,
  isPropsFilterVisible: PropTypes.bool.isRequired,
  togglePropsFilter: PropTypes.func.isRequired,
};

FormSubmissionFilterBar.defaultProps = {
  filters: null,
};

export default connect(mapStateToProps, mapActionsToProps)(FormSubmissionFilterBar);
