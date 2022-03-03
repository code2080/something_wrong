import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, Modal, Form, Input, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

// ACTIONS
import { updateFilter, setFilter } from '../../Redux/Filters/filters.actions';

// SELECTORS
import { selectFilter } from '../../Redux/Filters/filters.selectors';

// STYLES
import './FilterModal.scss';

// CONSTANTS
import { FormSubmissionFilterInterface } from '../../Models/FormSubmissionFilter.interface';

const mapStateToProps = (state, { objectScope, formId }) => {
  const scopedObjProps = _.get(
    state,
    `integration.mappedObjectTypes.${objectScope}`,
    {},
  );

  return {
    filters: selectFilter(state)(
      `${formId}_SUBMISSIONS`,
      FormSubmissionFilterInterface,
    ),
    objectScopeLabel: scopedObjProps.applicationObjectTypeLabel || null,
    fields: scopedObjProps.fields || [],
  };
};

const mapActionsToProps = {
  updateFilter,
  setFilter,
};

const FilterModal = ({
  formId,
  isVisible,
  onClose,
  filters,
  updateFilter,
  setFilter,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const onSaveAndClose = useCallback(() => {
    setFilter({
      filterId: `${formId}_SUBMISSIONS`,
      filter: localFilters,
    });
    onClose();
  }, [onClose, localFilters, updateFilter]);

  const onCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const onUpdateFilter = (key, value) => {
    setLocalFilters({
      ...localFilters,
      [key]: value,
    });
  };

  const onUpdateFilterSimple = useCallback(
    (key, value) => {
      onUpdateFilter(key, value);
    },
    [formId, localFilters],
  );

  return (
    <Modal
      title='Filter submissions'
      wrapClassName='filter-modal--wrapper'
      getContainer={() => document.getElementById('te-prefs-lib')}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      visible={isVisible}
      onOk={onSaveAndClose}
      onCancel={onCancel}
      footer={[
        <Button key='submit' type='primary' onClick={onSaveAndClose}>
          Close
        </Button>,
      ]}
    >
      <div className='filter-modal--pane'>
        <div className='filter-modal__pane--title'>General filters</div>
        <Form.Item label='Free text filter'>
          <Input
            placeholder='Filter...'
            value={localFilters.freeTextFilter}
            onChange={(e) =>
              onUpdateFilterSimple('freeTextFilter', e.target.value)
            }
            suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
            size='small'
          />
        </Form.Item>
        <Form.Item label='Show only own submissions'>
          <Switch
            checked={localFilters.onlyOwn}
            onChange={(onlyOwn) => onUpdateFilterSimple('onlyOwn', onlyOwn)}
            size='small'
          />
        </Form.Item>
        <Form.Item label='Show only starred submissions'>
          <Switch
            checked={localFilters.onlyStarred}
            onChange={(onlyStarred) =>
              onUpdateFilterSimple('onlyStarred', onlyStarred)
            }
            size='small'
          />
        </Form.Item>
      </div>
    </Modal>
  );
};

FilterModal.propTypes = {
  formId: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  updateFilter: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
};

FilterModal.defaultProps = {
  objectScopeLabel: null,
  fields: [],
};

export default connect(mapStateToProps, mapActionsToProps)(FilterModal);
