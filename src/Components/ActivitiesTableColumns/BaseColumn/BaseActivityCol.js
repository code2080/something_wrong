import React, { useMemo, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// STYLES
import './BaseActivityCol.scss';

// COMPONENTS
import BaseActivityColDropdown from './BaseActivityColDropdown';
import BaseActivityColValue from './BaseActivityColValue';
import InlineEdit from '../../ActivityEditing/InlineEdit';
import BaseActivityColModal from '../../ActivityEditing/ModalEdit';

// ACTIONS
import { overrideActivityValue, revertToSubmissionValue } from '../../../Redux/Activities/activities.actions';

// HELPERS
import { getMappingSettingsForProp, getMappingTypeForProp } from '../../../Redux/ReservationTemplateMapping/reservationTemplateMapping.helpers';

// CONSTANTS
import { activityActions, activityActionFilters, activityActionViews } from '../../../Constants/activityActions.constants';
import { activityViews } from '../../../Constants/activityViews.constants';

const getActivityValue = (activity, type, prop) => {
  const payload = type === 'VALUE' ? activity.values : activity.timing;
  return payload.find(el => el.extId === prop);
};

const resetView = () => ({ view: activityViews.VALUE_VIEW, action: null });

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
  // State var to hold the component's mode
  const [viewProps, setViewProps] = useState({ view: activityViews.VALUE_VIEW, action: null });

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

  // Memoized callback handler for when manual override is completed and activity should be updated
  const onFinishManualEditing = useCallback(value => {
    overrideActivityValue(value, activityValue, activity);
    setViewProps(resetView());
  }, [activityValue, activity, setViewProps]);

  // Memoized func object with the various editing possibilities
  const onActionCallback = useCallback(action => {
    /**
     * Most actions change the view props
     * but revert to submission value has no view impact
     * so we test for it first
     */
    if (action === activityActions.REVERT_TO_SUBMISSION_VALUE)
      /**
       * This will have to be augmented as some reverts affect more than one property, such as timeslot reverts
       */
      return revertToSubmissionValue(activityValue, activity);

    // Construct the new view props
    const updView = activityActionViews[action];
    if (!updView || updView == null) return;
    setViewProps({ view: updView, action });
  }, [revertToSubmissionValue, activity]);

  const activityValueActions = useMemo(() => Object.keys(activityActions)
    .filter(activityAction => activityActionFilters[activityAction](activityValue, activity, mapping)), [activityValue, activity, mapping]
  );

  return (
    <div className="base-activity-col--wrapper">
      {viewProps.view === activityViews.INLINE_EDIT && (
        <InlineEdit
          onFinish={onFinishManualEditing}
          onCancel={() => setViewProps(resetView())}
          activityValue={activityValue}
          activity={activity}
          action={viewProps.action}
        />
      )}
      {viewProps.view === activityViews.VALUE_VIEW && (
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
        mappingProps={mappingProps}
        availableActions={activityValueActions}
        onActionClick={onActionCallback}
      />
      <BaseActivityColModal
        activityValue={activityValue}
        activity={activity}
        formatFn={formatFn}
        mappingProps={mappingProps}
        propTitle={propTitle}
        prop={prop}
        onClose={() => setViewProps(resetView())}
        visible={viewProps.view === activityViews.MODAL_EDIT}
        action={viewProps.action}
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
