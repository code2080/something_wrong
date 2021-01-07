import React, { useMemo, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import _ from 'lodash';

// COMPONENTS
import BaseSectionTableView from './BaseSectionTableView';
import SectionExtra from './SectionExtra';

// HELPERS
import { determineSectionType } from '../../Utils/determineSectionType.helpers';
import {
  transformSectionToTableColumns,
  transformSectionValuesToTableRows,
} from '../../Utils/rendering.helpers';

// STYLES
import './BaseSection.scss';

// CONSTANTS
import { SECTION_AVAILABILITY, SECTION_CONNECTED, SECTION_TABLE } from '../../Constants/sectionTypes.constants';
import { selectSectionHasAvailabilityCalendar } from '../../Redux/Forms/forms.selectors';

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId, formInstanceId } }, section } = ownProps;
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
const BaseSection = ({ section, values, formId, formInstanceId }) => {
  // State var to hold if we should show extra or not
  const [showExtra, setShowExtra] = useState(false);

  const hasAvailabilityCalendar = useSelector(selectSectionHasAvailabilityCalendar(section.elements));

  // Memoized value of the section type
  const sectionType = hasAvailabilityCalendar ? SECTION_AVAILABILITY : determineSectionType(section);

  // Memoized var holding the columns
  const _columns = useMemo(() => {
    return transformSectionToTableColumns(section, sectionType, formInstanceId, formId)
  },
  [section]
  );

  // Memoized var holding the transformed section values
  const _data = useMemo(
    () => {
      return transformSectionValuesToTableRows(
        values,
        _columns,
        section._id,
        sectionType
      )
    },
    [section, values]
  );
  if (_.isEmpty(_columns)) return null;
  return (
    <div className="base-section--wrapper">
      <div className={`base-section--name__wrapper ${sectionType}`}>
        {section.name}
        {(sectionType === SECTION_CONNECTED || sectionType === SECTION_TABLE) && (
          <div
            className="base-section--extra__btn"
            onClick={() => setShowExtra(!showExtra)}
          >
            <Icon type="setting" />
          </div>
        )}
      </div>
      {showExtra && section && (sectionType === SECTION_CONNECTED || sectionType === SECTION_TABLE) && (
        <SectionExtra
          formId={formId}
          formInstanceId={formInstanceId}
          section={section}
          sectionType={sectionType}
        />
      )}
      <BaseSectionTableView columns={_columns} dataSource={_data} sectionId={section._id} />
    </div>
  );
};

BaseSection.propTypes = {
  section: PropTypes.object.isRequired,
  values: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  formId: PropTypes.string.isRequired,
  formInstanceId: PropTypes.string.isRequired,
};

export default withRouter(connect(mapStateToProps, null)(BaseSection));
