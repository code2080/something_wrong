import React, { useMemo, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notification } from 'antd';

// STYLES
import './BaseActivityCol.scss';

// COMPONENTS
import BaseActivityColDropdown from './BaseActivityColDropdown';
import BaseActivityColValue from './BaseActivityColValue';
import InlineEdit from '../../ActivityEditing/InlineEdit';
import ModalEdit from '../../ActivityEditing/ModalEdit';
import withTECoreAPI from '../../TECoreAPI/withTECoreAPI';

// ACTIONS
import {
  overrideActivityValue,
  revertToSubmissionValue
} from '../../../Redux/Activities/activities.actions';
import { setExtIdPropsForObject } from '../../../Redux/TE/te.actions';
import { beginExternalAction, endExternalAction } from '../../../Redux/GlobalUI/globalUI.actions';

// HELPERS
import {
  getMappingSettingsForProp,
  getMappingTypeForProp
} from '../../../Redux/ActivityDesigner/activityDesigner.helpers';

// CONSTANTS
import {
  activityActions,
  activityActionFilters,
  activityActionViews,
  externalActivityActionMapping
} from '../../../Constants/activityActions.constants';
import { activityViews } from '../../../Constants/activityViews.constants';

const getActivityValue = (activity, type, prop) => {
  const payload = type === 'VALUE' ? activity.values : activity.timing;
  return payload.find(el => el.extId === prop);
};

const resetView = () => ({ view: activityViews.VALUE_VIEW, action: null });

const mapStateToProps = (state, { activity: { _id: activityId }, prop }) => ({
  hasOngoingExternalAction:
    state.globalUI.externalAction &&
    state.globalUI.externalAction.activityId === activityId &&
    state.globalUI.externalAction.prop === prop,
});

const mapActionsToProps = {
  overrideActivityValue,
  revertToSubmissionValue,
  setExtIdPropsForObject,
  beginExternalAction,
  endExternalAction,
};

const BaseActivityCol = ({
  activity,
  type,
  prop,
  hasOngoingExternalAction,
  propTitle,
  formatFn,
  mapping,
  overrideActivityValue,
  revertToSubmissionValue,
  setExtIdPropsForObject,
  beginExternalAction,
  endExternalAction,
  teCoreAPI
}) => {
  // State var to hold the component's mode
  const [viewProps, setViewProps] = useState({
    view: activityViews.VALUE_VIEW,
    action: null
  });

  // Memoized activity value
  const activityValue = useMemo(() => getActivityValue(activity, type, prop), [
    activity,
    type,
    prop
  ]);
  // Memoized properties of the prop the value is mapped to on the activity template
  const mappingProps = useMemo(() => {
    return {
      settings: getMappingSettingsForProp(activityValue.extId, mapping),
      type: getMappingTypeForProp(activityValue.extId, mapping)
    };
  }, [activityValue, mapping]);

  // Memoized callback handler for when manual override is completed and activity should be updated
  const onFinishManualEditing = useCallback(
    value => {
      overrideActivityValue(value, activityValue, activity);
      setViewProps(resetView());
    },
    [activityValue, activity, setViewProps]
  );

  const onProcessObjectReturn = res => {
    try {
      // Grab the extid and the fields
      const { extid, fields } = res;
      // Override the activity
      overrideActivityValue([extid], activityValue, activity);
      // Grab the label
      const labelField = fields[0].values[0];
      setExtIdPropsForObject(extid, { label: labelField });
    } catch (error) {
      notification.error({
        getContainer: () => document.getElementById('te-prefs-lib'),
        message: 'Operation failed',
        description: `Something went wrong...`,
      });
    }
  }

  const onProcessFilterReturn = res => {
    try {
      // Grab the extid and the fields
      const { extid, fields } = res;
      // Override the activity
      overrideActivityValue([extid], activityValue, activity);
      // Grab the label
      const labelField = fields[0].values[0];
      setExtIdPropsForObject(extid, { label: labelField });
    } catch (error) {
      notification.error({
        getContainer: () => document.getElementById('te-prefs-lib'),
        message: 'Operation failed',
        description: `Something went wrong...`,
      });
    }
  }

  const onFinshExternalEdit = (res, action) => {
    console.log('im called');
    /**
     * Regardless of external action type; we should reset the external action
     * redux state prop by ending the action
     */
    // endExternalAction();
    /**
     * We need to parse the response differently depending on action
     */
    switch (action) {
      case activityActions.EDIT_OBJECT:
        return onProcessObjectReturn(res);
      case activityActions.SELECT_OBJECT_FROM_FILTER_OVERRIDE:
        return onProcessObjectReturn(res);
      case activityActions.EDIT_FILTER_OVERRIDE:
        return onProcessFilterReturn(res);
      default:
        break;
    }
  };

  // Memoized func object with the various editing possibilities
  const onActionCallback = useCallback(
    async action => {
      /**
       * Most actions change the view props
       * but revert to submission value has no view impact
       * so we test for it first
       */
      if (action === activityActions.REVERT_TO_SUBMISSION_VALUE)
        return revertToSubmissionValue(activityValue, activity);

      // Construct the new view props
      const updView = activityActionViews[action];
      if (!updView || updView == null) return;
      if (updView === activityViews.EXTERNAL_EDIT) {
        // Set the redux state prop
        beginExternalAction(activity._id, prop);
        // Here begins our journey into the belly of TE Core
        const callName = externalActivityActionMapping[action];
        teCoreAPI[callName]({
          activityValue,
          activity,
          callback: res => onFinshExternalEdit(res, action)
        });
      } else {
        setViewProps({ view: updView, action });
      }
    },
    [revertToSubmissionValue, activity, viewProps, setViewProps]
  );

  const activityValueActions = useMemo(
    () =>
      Object.keys(activityActions).filter(activityAction =>
        activityActionFilters[activityAction](activityValue, activity, mapping)
      ),
    [activityValue, activity, mapping]
  );

  return (
    <div className={`base-activity-col--wrapper ${hasOngoingExternalAction ? 'is-active' : ''}`}>
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
        disabled={hasOngoingExternalAction}
      />
      <ModalEdit
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
  hasOngoingExternalAction: PropTypes.bool,
  propTitle: PropTypes.string,
  formatFn: PropTypes.func,
  mapping: PropTypes.object,
  overrideActivityValue: PropTypes.func.isRequired,
  revertToSubmissionValue: PropTypes.func.isRequired,
  setExtIdPropsForObject: PropTypes.func.isRequired,
  beginExternalAction: PropTypes.func.isRequired,
  endExternalAction: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired
};

BaseActivityCol.defaultProps = {
  type: 'VALUE',
  propTitle: null,
  formatFn: value => value,
  mapping: null,
  hasOngoingExternalAction: false,
};

export default connect(mapStateToProps, mapActionsToProps)(withTECoreAPI(BaseActivityCol));
