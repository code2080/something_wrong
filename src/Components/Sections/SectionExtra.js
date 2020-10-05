import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';

// COMPONENTS
import CalendarSettings from './CalendarSettings';
import SelectionSettings from './SelectionSettings';

// STYLES
import './SectionExtra.scss';

// CONSTANTS
import { SECTION_TABLE, SECTION_CONNECTED } from '../../Constants/sectionTypes.constants';

const panels = {
  CALENDAR_SETTINGS: 'CALENDAR_SETTINGS',
  SELECT_SETTINGS: 'SELECT_SETTINGS',
};

const SectionExtra = ({ formId, formInstanceId, section, sectionType }) => {
  const defaultActiveKey = useMemo(() => {
    if (sectionType === SECTION_CONNECTED || sectionType === SECTION_TABLE)
      return [panels.SELECT_SETTINGS];
    if (section.calendarSettings)
      return [panels.CALENDAR_SETTINGS];
    return [];
  }, [section, sectionType]);

  return (
    <div className="base-section__extra--wrapper">
      <Collapse
        bordered={false}
        defaultActiveKey={defaultActiveKey}
      >
        {(sectionType === SECTION_TABLE || sectionType === SECTION_CONNECTED) && (
          <Collapse.Panel header="Selection settings" key={panels.SELECT_SETTINGS}>
            <SelectionSettings
              formId={formId}
              formInstanceId={formInstanceId}
              section={section}
            />
          </Collapse.Panel>
        )}
        {section && section.calendarSettings && (
          <Collapse.Panel header="Calendar Settings" key={panels.CALENDAR_SETTINGS}>
            <CalendarSettings calendarSettings={section.calendarSettings} />
          </Collapse.Panel>
        )}
      </Collapse>
    </div>
  );
};

SectionExtra.propTypes = {
  formId: PropTypes.string.isRequired,
  formInstanceId: PropTypes.string.isRequired,
  section: PropTypes.object.isRequired,
  sectionType: PropTypes.string.isRequired,
};

export default SectionExtra;
