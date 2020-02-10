import React, { useMemo, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// STYLES
import './BaseReservationCol.scss';

// COMPONENTS
import BaseReservationColDropdown from './BaseReservationColDropdown';
import BaseReservationColValue from './BaseReservationColValue';
import ManualEditingComponent from './ManualEditingComponent';
import BaseReservationColModal from './BaseReservationColModal';

// ACTIONS
import { overrideReservationValue, revertToSubmissionValue } from '../../Redux/Reservations/reservations.actions';

// HELPERS
import { getMappingSettingsForProp, getMappingTypeForProp } from '../../Redux/Mapping/mappings.helpers';

// CONSTANTS
import { reservationActions } from '../../Constants/reservationActions.constants';
import { mappingTimingModes } from '../../Constants/mappingTimingModes.constants';
import { mappingTypes } from '../../Constants/mappingTypes.constants';
import { manualEditingModes } from '../../Constants/manualEditingModes.constants';

const getReservationValue = (reservation, type, prop) => {
  const payload = type === 'VALUE' ? reservation.values : reservation.timing;
  return payload.find(el => el.extId === prop);
};

const mapActionsToProps = {
  overrideReservationValue,
  revertToSubmissionValue,
};

/**
 * MAPPING:
 *  mandatory / not mandatory
 *  mapped to field
 *  mapped to object
 * RESERVATION VALUE MODES:
 *  FROM_SUBMISSION
 *  MANUAL
 * SUBMISSION VALUE TYPES
 *  OBJECT
 *  FREE_TEXT
 *  TIMING
 *  FILTER
 */

/**
 * @logic
 * x) Always let user choose manual override
 *    DONE x) if mapped to object -> let user select object
 *    DONE x) if mapped to field -> let user input other value
 *    DONE x) if submissionValue is missing and mapping is mandatory => highlight entire column as faulty
 * x) If value mode is BEST_FIT:
 *    x) User can choose to select value now
 *       x) For submissionValueType === OBJECT: send call to TEC with filters (if any)
 * x) If multiple submission values -> let user toggle and set value
 * DONE x) Display icon:
 *    DONE x) If valueMode === MANUAL -> always display manual
 *    DONE x) If submissionValueType === FILTER -> display filter
 *    DONE x) Else, display from submission
 * x) Scheduling logic:
 *    DONE x) If valueMode === FROM_SUBMISSION && submissionValueType === FILTER => BEST_FIT
 *    DONE x) If submissionValueType === TIMING && mapping.timing.mode === TIMESLOTS => BEST_FIT
 *    DONE x) All other cases: with value from submission
 * x) Visualization:
 *    DONE x) Visualize unschedulable reservations (missing information)
 *    DONE x) For timing col on timeslots, show submission value and length param (if length param is valid)
 * x) Show all info:
 *    DONE x) Build modal to show all information
 */

const BaseReservationCol = ({
  reservation,
  type,
  prop,
  propTitle,
  formatFn,
  mapping,
  overrideReservationValue,
  revertToSubmissionValue,
}) => {
  // State var to hold if in edit mode
  const [isInEditMode, setIsInEditMode] = useState(false);
  // State var to hold if show details modal is open
  const [showShowDetailsModal, setShowShowDetailsModal] = useState(false);
  // Memoized reservation value
  const reservationValue = useMemo(
    () => getReservationValue(reservation, type, prop),
    [reservation, type, prop]
  );
  // Memoized properties of the prop the value is mapped to on the reservation template
  const mappingProps = useMemo(() => {
    return {
      settings: getMappingSettingsForProp(reservationValue.extId, mapping),
      type: getMappingTypeForProp(reservationValue.extId, mapping),
    };
  }, [reservationValue, mapping]);

  // Memoized value determining what type of manual editing can be done on this property
  const manualEditingMode = useMemo(() => {
    /**
     * Can only be edited manually if:
     * a) It's mapped to a field
     * b) It's the length parameter in timing and mode is timeslots
     */
    if (mappingProps.type === mappingTypes.FIELD) return manualEditingModes.TEXT_INPUT;
    if (reservationValue.extId === 'length' && mapping.timing.mode === mappingTimingModes.TIMESLOTS) return manualEditingModes.NUMBER_INPUT;
    return manualEditingModes.NOT_ALLOWED;
  }, [mappingProps, reservationValue, mapping]);

  // Callback for reverting to submission value
  const onRevertToSubmissionValue = useCallback(
    () => revertToSubmissionValue(reservationValue, reservation),
    [reservationValue, reservation]
  );

  // Callback for manual input override
  const onManualInputOverride = useCallback(() => {
    if (manualEditingMode !== manualEditingModes.NOT_ALLOWED)
      setIsInEditMode(!isInEditMode);
  }, [manualEditingMode]);

  // Memoized callback handler for when manual override is completed and reservation should be updated
  const onFinishManualEditing = useCallback(value => {
    overrideReservationValue(value, reservationValue, reservation);
    setIsInEditMode(false);
  }, [reservationValue, reservation, setIsInEditMode]);

  // Memoized func object with the various editing possibilities
  const reservationActionFnsObj = useMemo(() => ({
    [reservationActions.MANUAL_INPUT_OVERRIDE]: () => onManualInputOverride(),
    [reservationActions.MANUAL_SELECT_OVERRIDE]: reservationValue => console.log(`Manual select for ${reservationValue.extId}`),
    [reservationActions.SELECT_BEST_FIT_VALUE]: reservationValue => console.log(`Best fit select for ${reservationValue.extId}`),
    [reservationActions.SHOW_INFO]: () => setShowShowDetailsModal(true),
    [reservationActions.REVERT_TO_SUBMISSION_VALUE]: () => onRevertToSubmissionValue(),
  }), [reservationActions]);

  return (
    <div className="base-reservation-col--wrapper">
      {isInEditMode ? (
        <ManualEditingComponent
          onFinish={onFinishManualEditing}
          onCancel={() => setIsInEditMode(false)}
          reservationValue={reservationValue}
          manualEditingMode={manualEditingMode}
        />
      ) : (
        <BaseReservationColValue
          reservationValue={reservationValue}
          reservation={reservation}
          formatFn={formatFn}
        />
      )}
      <BaseReservationColDropdown
        reservationValue={reservationValue}
        reservation={reservation}
        formatFn={formatFn}
        mapping={mapping}
        reservationActionFns={reservationActionFnsObj}
        mappingProps={mappingProps}
      />
      <BaseReservationColModal
        reservationValue={reservationValue}
        reservation={reservation}
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

BaseReservationCol.propTypes = {
  reservation: PropTypes.object.isRequired,
  type: PropTypes.string,
  prop: PropTypes.string.isRequired,
  propTitle: PropTypes.string,
  formatFn: PropTypes.func,
  mapping: PropTypes.object,
  overrideReservationValue: PropTypes.func.isRequired,
  revertToSubmissionValue: PropTypes.func.isRequired,
};

BaseReservationCol.defaultProps = {
  type: 'VALUE',
  propTitle: null,
  formatFn: value => value,
  mapping: null,
};

export default connect(null, mapActionsToProps)(BaseReservationCol);
