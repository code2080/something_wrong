import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card } from 'antd';

// COMPONENTS
import ViewSelector from './ViewSelector';
import BaseSectionTableView from './BaseSectionTableView';
import BaseSectionListView from './BaseSectionListView';

// HELPERS
import { extractColumnsFromSection, extractColumnDataFromValues } from '../../Utils/sectionHelpers';
import { determineSectionType } from '../../Utils/determineSectionType';

// STYLES
import './BaseSection.scss';

// CONSTANTS
import { sectionViews } from '../../Constants/sectionViews.constants';

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId, formInstanceId } }, section } = ownProps;
  return {
    values: state.submissions[formId][formInstanceId].values[section._id] || [],
  };
};

/**
 * @todo
 * 3) Add styling to improve section separation
 */
const BaseSection = ({ section, values }) => {
  // State var to hold current view (table or list)
  const [view, setView] = useState(sectionViews.TABLE_VIEW);
  // Memoized value of the section type
  const sectionType = determineSectionType(section);
  // Memoized var holding the columns
  const _columns = useMemo(() => extractColumnsFromSection(section, sectionType), [section]);

  // Memoized var holding the transformed section values
  const _data = useMemo(
    () => extractColumnDataFromValues(
      values,
      _columns,
      section._id,
      sectionType
    ),
    [section, values]
  );
  return (
    <div className="base-section--wrapper">
      <Card
        size="small"
        title={section.name}
        extra={<ViewSelector view={view} onViewChange={setView} />}
      >
        {view === sectionViews.TABLE_VIEW && (
          <BaseSectionTableView columns={_columns} dataSource={_data} />
        )}
        {view === sectionViews.LIST_VIEW && (
          <BaseSectionListView columns={_columns} dataSource={_data} />
        )}
      </Card>
    </div>
  );
};

BaseSection.propTypes = {
  section: PropTypes.object.isRequired,
  values: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};

export default withRouter(connect(mapStateToProps, null)(BaseSection));
