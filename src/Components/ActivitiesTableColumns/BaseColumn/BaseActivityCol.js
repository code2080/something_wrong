import React, { useRef, useMemo, useState, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { notification, Menu, Dropdown } from 'antd';

// STYLES
import './BaseActivityCol.scss';

// COMPONENTS
import BaseActivityColValue from './BaseActivityColValue';
import InlineEdit from '../../ActivityEditing/InlineEdit';
import ModalEdit from '../../ActivityEditing/ModalEdit';
import withTECoreAPI from '../../TECoreAPI/withTECoreAPI';
import BaseReservationColQuickview from './BaseActivityColQuickview';

// ACTIONS
import {
  overrideActivityValue,
  revertToSubmissionValue
} from '../../../Redux/Activities/activities.actions';
import { setExtIdPropsForObject } from '../../../Redux/TE/te.actions';
import { setExternalAction } from '../../../Redux/GlobalUI/globalUI.actions';

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
  externalActivityActionMapping,
  activityActionLabels
} from '../../../Constants/activityActions.constants';
import { activityViews } from '../../../Constants/activityViews.constants';

const resetView = () => ({ view: activityViews.VALUE_VIEW, action: null });

const mapActionsToProps = {
  overrideActivityValue,
  revertToSubmissionValue,
  setExtIdPropsForObject,
};

const getActivityValue = (activityValue, activity, type, prop) => {
  if (activityValue) return activityValue;
  const payload = type === 'VALUE' ? activity.values : activity.timing;
  return payload.find(el => el.extId === prop);
};

const BaseActivityCol = ({
  activityValue,
  activity,
  prop: typeExtId,
  type,
  propTitle,
  formatFn,
  mapping,
  overrideActivityValue,
  revertToSubmissionValue,
  setExtIdPropsForObject,
  teCoreAPI
}) => {
  const dispatch = useDispatch();
  const spotlightedElRef = useRef(null);

  // Activity value
  const _activityValue = getActivityValue(activityValue, activity, type, typeExtId);
  // State var to hold the component's mode
  const [viewProps, setViewProps] = useState({
    view: activityViews.VALUE_VIEW,
    action: null
  });

  // State var to hold the dropdown's visibility
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const _setIsDropdownVisible = vis => {
    if (viewProps.view === activityViews.MODAL_EDIT) return setIsDropdownVisible(false);
    return setIsDropdownVisible(vis);
  };

  // Memoized properties of the prop the value is mapped to on the activity template
  const mappingProps = useMemo(() => {
    return {
      settings: getMappingSettingsForProp(_activityValue.extId, mapping),
      type: getMappingTypeForProp(_activityValue.extId, mapping)
    };
  }, [_activityValue, mapping]);

  const handleMenuClick = ({ key }) => {
    _setIsDropdownVisible(false);
    onActionCallback(key);
  }

  // Memoized callback handler for when manual override is completed and activity should be updated
  const onFinishManualEditing = useCallback(
    value => {
      overrideActivityValue(value, _activityValue, activity);
      setViewProps(resetView());
    },
    [_activityValue, activity, setViewProps]
  );

  const onProcessObjectReturn = res => {
    if (res === null) {
      return;
    }
    try {
      // Grab the extid and the fields
      const { extid, fields } = res;
      // Override the activity
      overrideActivityValue([extid], _activityValue, activity);
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
    if (res === null) {
      return;
    }
    // Map res to PiC format
    try {
      // Override the activity
      overrideActivityValue(res, _activityValue, activity);
      // Do something label-ish?
    } catch (error) {
      notification.error({
        getContainer: () => document.getElementById('te-prefs-lib'),
        message: 'Operation failed',
        description: `Something went wrong...`,
      });
    }
  }

  const onFinshExternalEdit = (res, action) => {
    /**
     * Regardless of external action type; we should reset the external action
     * redux state prop by ending the action
     */
    dispatch(setExternalAction(null));
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
        return revertToSubmissionValue(_activityValue, activity);

      // Construct the new view props
      const updView = activityActionViews[action];
      if (!updView || updView == null) return;
      if (updView === activityViews.EXTERNAL_EDIT) {
        // Set the redux state prop
        dispatch(setExternalAction(spotlightedElRef));
        // Here begins our journey into the belly of TE Core
        const callName = externalActivityActionMapping[action];
        teCoreAPI[callName]({
          activityValue: _activityValue,
          objectExtId: activityValue.value,
          typeExtId: activityValue.extId,      
          callback: res => onFinshExternalEdit(res, action)
        });
      } else {
        setViewProps({ view: updView, action });
      }
    },
    [_activityValue, revertToSubmissionValue, activity, viewProps, setViewProps, setIsDropdownVisible]
  );

  const activityValueActions = useMemo(
    () =>
      Object.keys(activityActions).filter(activityAction =>
        activityActionFilters[activityAction](_activityValue, activity, mapping)
      ),
    [_activityValue, activity, mapping]
  );

  const menuOptions = useMemo(() => {
    return (
      <Menu onClick={handleMenuClick}>
        <BaseReservationColQuickview
          activityValue={_activityValue}
          mappingProps={mappingProps}
          activity={activity}
          formatFn={formatFn}
        />
        <Menu.Divider />
        {(activityValueActions || []).map(action => (
          <Menu.Item key={action}>{activityActionLabels[action]}</Menu.Item>
        ))}
      </Menu>
    );
  }, [_activityValue, activityValueActions]);

  return (
    <Dropdown
      overlay={menuOptions}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      visible={isDropdownVisible}
      onVisibleChange={_setIsDropdownVisible}
      trigger={['hover']}
    >
      <div className={'base-activity-col--wrapper'} ref={spotlightedElRef}>
        {viewProps.view === activityViews.INLINE_EDIT && (
          <InlineEdit
            onFinish={onFinishManualEditing}
            onCancel={() => setViewProps(resetView())}
            activityValue={_activityValue}
            activity={activity}
            action={viewProps.action}
          />
        )}
        {viewProps.view === activityViews.VALUE_VIEW && (
          <BaseActivityColValue
            activityValue={_activityValue}
            activity={activity}
            formatFn={formatFn}
          />
        )}
        <ModalEdit
          activityValue={_activityValue}
          activity={activity}
          formatFn={formatFn}
          mappingProps={mappingProps}
          propTitle={propTitle}
          prop={typeExtId}
          onClose={() => setViewProps(resetView())}
          visible={viewProps.view === activityViews.MODAL_EDIT}
          action={viewProps.action}
        />
      </div>
    </Dropdown>
  );
};

BaseActivityCol.propTypes = {
  activityValue: PropTypes.object,
  activity: PropTypes.object.isRequired,
  prop: PropTypes.string.isRequired,
  type: PropTypes.string,
  propTitle: PropTypes.string,
  formatFn: PropTypes.func,
  mapping: PropTypes.object,
  overrideActivityValue: PropTypes.func.isRequired,
  revertToSubmissionValue: PropTypes.func.isRequired,
  setExtIdPropsForObject: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired
};

BaseActivityCol.defaultProps = {
  activityValue: null,
  propTitle: null,
  type: 'VALUE',
  formatFn: value => value,
  mapping: null,
};

export default connect(null, mapActionsToProps)(withTECoreAPI(BaseActivityCol));
