import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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
import { makeSelectFormInstance } from '../../Redux/FormSubmissions/formSubmissions.selectors';

/**
 * @todo
 * 3) Add styling to improve section separation
 */

const BaseSection = ({ section, objectRequests }) => {
  // Memoized value of the section type
  const sectionType = determineSectionType(section);
  const { formId, formInstanceId } = useParams();
  const selectSubmission = useMemo(() => makeSelectFormInstance(), []);
  const submission = useSelector((state) =>
    selectSubmission(state, { formId, formInstanceId }),
  );
  const submissionValues = useMemo(
    () => submission.values[section._id] || [],
    [submission.values, section._id],
  );

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
        submissionValues,
        _columns,
        section._id,
        sectionType,
        objectRequests,
      ),
    [_columns, section._id, sectionType, submissionValues, objectRequests],
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
  objectRequests: PropTypes.object,
};

export default BaseSection;
