import { useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

// COMPONENTS
import DynamicTable from '../DynamicTable/DynamicTableHOC';
import ExpandedPane from '../TableColumns/Components/ExpandedPane';

// HELPERS
import { determineSectionType } from '../../Utils/determineSectionType.helpers';
import {
  transformSectionToTableColumns,
  transformSectionValuesToTableRows,
} from '../../Utils/rendering.helpers';

// STYLES
import './BaseSection.scss';

// CONSTANTS
import { tableViews } from '../../Constants/tableViews.constants';

// CONSTANTS
const mapStateToProps = (state, ownProps) => {
  const { formId, formInstanceId, section } = ownProps;
  return {
    values: state.submissions[formId][formInstanceId].values[section._id] || [],
    formId,
    formInstanceId,
  };
};

/**
 * @todo
 * 3) Add styling to improve section separation
 */

const BaseSection = ({
  section,
  values,
  formId,
  formInstanceId,
  objectRequests,
}) => {
  // Memoized value of the section type
  const sectionType = determineSectionType(section);
  // Memoized var holding the columns
  const _columns = useMemo(
    () =>
      transformSectionToTableColumns(
        section,
        sectionType,
        formInstanceId,
        formId,
        objectRequests,
      ),
    [formId, formInstanceId, section, sectionType, objectRequests],
  );

  // Memoized var holding the transformed section values
  const _data = useMemo(
    () =>
      transformSectionValuesToTableRows(
        values,
        _columns,
        section._id,
        sectionType,
        objectRequests,
      ),
    [_columns, section._id, sectionType, values, objectRequests],
  );
  if (_.isEmpty(_columns)) return null;
  return (
    <div className='base-section--wrapper'>
      <div className='base-section--name__wrapper'>{section.name}</div>
      <DynamicTable
        className='table table--values'
        columns={_columns}
        dataSource={_data}
        rowKey='rowKey'
        pagination={false}
        expandedRowRender={(row) => (
          <ExpandedPane columns={_columns} row={row} />
        )}
        datasourceId={`${tableViews.SECTION}-${section._id}`}
        resizable
        showFilter={false}
      />
    </div>
  );
};

BaseSection.propTypes = {
  section: PropTypes.object.isRequired,
  values: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  formId: PropTypes.string.isRequired,
  formInstanceId: PropTypes.string.isRequired,
  objectRequests: PropTypes.object,
};

export default withRouter(connect(mapStateToProps, null)(BaseSection));
