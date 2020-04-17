import React, { useMemo, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// STYLES
import './BaseActivityCol.scss';

// COMPONENTS
import BaseActivityColDropdown from './BaseActivityColDropdown';
import BaseActivityColValue from './BaseActivityColValue';
import ManualEditingComponent from '../../ActivityEditing/ManualEditingComponent';
import BaseActivityColModal from './BaseActivityColModal';

// ACTIONS
import { overrideActivityValue, revertToSubmissionValue } from '../../../Redux/Activities/activities.actions';

// HELPERS
import { getMappingSettingsForProp, getMappingTypeForProp } from '../../../Redux/ReservationTemplateMapping/reservationTemplateMapping.helpers';

// CONSTANTS
import { activityActions } from '../../../Constants/activityActions.constants';
import { mappingTimingModes } from '../../../Constants/mappingTimingModes.constants';
import { mappingTypes } from '../../../Constants/mappingTypes.constants';
import { manualEditingModes } from '../../../Constants/manualEditingModes.constants';

const getActivityValue = (activity, type, prop) => {
  const payload = type === 'VALUE' ? activity.values : activity.timing;
  return payload.find(el => el.extId === prop);
};

const mapActionsToProps = {
  overrideActivityValue,
  revertToSubmissionValue,
};

const BaseActivityCol = ({
  activity,
  type,
  prop,
  propTitle,
  formatFn,
  mapping,
  overrideActivityValue,
  revertToSubmissionValue,
}) => {
  // State var to hold if in edit mode
  const [isInEditMode, setIsInEditMode] = useState(false);
  // State var to hold if show details modal is open
  const [showShowDetailsModal, setShowShowDetailsModal] = useState(false);
  // Memoized activity value
  const activityValue = useMemo(
    () => getActivityValue(activity, type, prop),
    [activity, type, prop]
  );
  // Memoized properties of the prop the value is mapped to on the activity template
  const mappingProps = useMemo(() => {
    return {
      settings: getMappingSettingsForProp(activityValue.extId, mapping),
      type: getMappingTypeForProp(activityValue.extId, mapping),
    };
  }, [activityValue, mapping]);

  // Memoized value determining what type of manual editing can be done on this property
  const manualEditingMode = useMemo(() => {
    /**
     * Can only be edited manually if:
     * a) It's mapped to a field => TEXT_INPUT editing
     * b) It's a timing property and the timing mode is exact => DATETIME_PICKER
     * b) It's the length parameter in timing and mode is timeslots NUMBER_INPUT
     */
    if (mappingProps.type === mappingTypes.FIELD) return manualEditingModes.TEXT_INPUT;
    if (mappingProps.type === mappingTypes.TIMING && mapping.timing.mode === mappingTimingModes.EXACT) return manualEditingModes.DATETIME_PICKER;
    if (activityValue.extId === 'length' && mapping.timing.mode === mappingTimingModes.TIMESLOTS) return manualEditingModes.NUMBER_INPUT;
    return manualEditingModes.NOT_ALLOWED;
  }, [mappingProps, activityValue, mapping]);

  // Callback for manual input override
  const onManualInputOverride = useCallback(() => {
    if (manualEditingMode !== manualEditingModes.NOT_ALLOWED)
      setIsInEditMode(!isInEditMode);
  }, [manualEditingMode]);

  // Memoized callback handler for when manual override is completed and activity should be updated
  const onFinishManualEditing = useCallback(value => {
    overrideActivityValue(value, activityValue, activity);
    setIsInEditMode(false);
  }, [activityValue, activity, setIsInEditMode]);

  // Memoized func object with the various editing possibilities
  const reservationActionFnsObj = useMemo(() => ({
    [activityActions.MANUAL_INPUT_OVERRIDE]: () => onManualInputOverride(),
    [activityActions.MANUAL_SELECT_OVERRIDE]: activityValue => console.log(`Manual select for ${activityValue.extId}`),
    [activityActions.SELECT_BEST_FIT_VALUE]: activityValue => console.log(`Best fit select for ${activityValue.extId}`),
    [activityActions.SHOW_INFO]: () => setShowShowDetailsModal(true),
    [activityActions.REVERT_TO_SUBMISSION_VALUE]: () => revertToSubmissionValue(activityValue, activity),
  }), [activityActions, activityValue, activity]);

  return (
    <div className="base-activity-col--wrapper">
      {isInEditMode ? (
        <ManualEditingComponent
          onFinish={onFinishManualEditing}
          onCancel={() => setIsInEditMode(false)}
          activityValue={activityValue}
          manualEditingMode={manualEditingMode}
        />
      ) : (
        <BaseActivityColValue
          activityValue={activityValue}
          activity={activity}
          formatFn={formatFn}
        />
      )}
      <BaseActivityColDropdown
        activityValue={activityValue}
        activity={activity}
        formatFn={formatFn}
        mapping={mapping}
        reservationActionFns={reservationActionFnsObj}
        mappingProps={mappingProps}
      />
      <BaseActivityColModal
        activityValue={activityValue}
        activity={activity}
        formatFn={formatFn}
        mappingProps={mappingProps}
        propTitle={propTitle}
        prop={prop}
        onClose={() => setShowShowDetailsModal(false)}
        visible={showShowDetailsModal}
      />
    </div>
  );
};

BaseActivityCol.propTypes = {
  activity: PropTypes.object.isRequired,
  type: PropTypes.string,
  prop: PropTypes.string.isRequired,
  propTitle: PropTypes.string,
  formatFn: PropTypes.func,
  mapping: PropTypes.object,
  overrideActivityValue: PropTypes.func.isRequired,
  revertToSubmissionValue: PropTypes.func.isRequired,
};

BaseActivityCol.defaultProps = {
  type: 'VALUE',
  propTitle: null,
  formatFn: value => value,
  mapping: null,
};

export default connect(null, mapActionsToProps)(BaseActivityCol);
