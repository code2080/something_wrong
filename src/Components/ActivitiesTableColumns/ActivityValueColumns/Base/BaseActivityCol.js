import React, { useRef, useMemo, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { notification, Menu, Dropdown } from 'antd';

// STYLES
import './BaseActivityCol.scss';

// COMPONENTS
import BaseActivityColValue from './BaseActivityColValue';
import InlineEdit from '../../../ActivityEditing/InlineEdit';
import ModalEdit from '../../../ActivityEditing/ModalEdit';
import withTECoreAPI from '../../../TECoreAPI/withTECoreAPI';

// ACTIONS
import {
  overrideActivityValue,
  revertToSubmissionValue
} from '../../../../Redux/Activities/activities.actions';
import { setExtIdPropsForObject } from '../../../../Redux/TE/te.actions';
import { setExternalAction } from '../../../../Redux/GlobalUI/globalUI.actions';

// HELPERS
import {
  getMappingSettingsForProp,
  getMappingTypeForProp
} from '../../../../Redux/ActivityDesigner/activityDesigner.helpers';

import {
  getNormalizedActivityValue,
  resetView,
  mapCoreCategoryObjectToCategories,
} from '../Helpers/helpers';

// CONSTANTS
import {
  activityActions,
  activityActionFilters,
  activityActionViews,
  externalActivityActionMapping,
  activityActionLabels
} from '../../../../Constants/activityActions.constants';
import { activityViews } from '../../../../Constants/activityViews.constants';
import { activityIsReadOnly } from '../../../../Utils/activities.helpers';

const mapActionsToProps = {
  overrideActivityValue,
  revertToSubmissionValue,
  setExtIdPropsForObject,
};

const BaseActivityCol = ({
  activityValue,
  activity,
  prop: typeExtId,
  type,
  propTitle,
  formatFn,
  mapping: design,
  overrideActivityValue,
  revertToSubmissionValue,
  setExtIdPropsForObject,
  teCoreAPI
}) => {
  const dispatch = useDispatch();
  const spotlightedElRef = useRef(null);

  // Activity value
  const _activityValue = getNormalizedActivityValue(activityValue, activity, type, typeExtId);

  /**
   * STATE
   */
  // Component's view mode
  const [viewProps, setViewProps] = useState({
    view: activityViews.VALUE_VIEW,
    action: null
  });

  // Dropdown visibility
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  /**
   * MEMOIZED PROPS
   */

  // Get the properties of the mapped value on the activity design
  const propertiesForMappedDesignValue = useMemo(() => {
    return {
      settings: getMappingSettingsForProp(_activityValue.extId, design),
      type: getMappingTypeForProp(_activityValue.extId, design)
    };
  }, [_activityValue, design]);

  // Valid dropdown actions for the activity value
  const validActivityValueActions = useMemo(
    () => {
      const actions = activityIsReadOnly(activity.activityStatus) ? [activityActions.SHOW_INFO] : Object.keys(activityActions);
      return actions.filter(activityAction =>
        activityActionFilters[activityAction](_activityValue, activity, design)
      );
    },
    [_activityValue, activity, design]
  );

  /**
   * EVENT HANDLERS
   */
  // On update dropdown visibility state
  const onUpdateDropdownVisibility = vis => {
    if (viewProps.view === activityViews.MODAL_EDIT) return setIsDropdownVisible(false);
    return setIsDropdownVisible(vis);
  };

  // On callback from manual editing
  const onFinishManualEditing = value => {
    overrideActivityValue(value, _activityValue, activity);
    setViewProps(resetView());
  };

  // On failed callback from external edit action
  const onFailedExternalEditCallback = () =>
    notification.error({
      getContainer: () => document.getElementById('te-prefs-lib'),
      message: 'Operation failed',
      description: 'Something went wrong...',
    });

  // On callback from actions EDIT_OBJECT, SELECT_OBJECT_FROM_FILTER_OVERRIDE
  const onProcessExternalActionWithObjectReturn = res => {
    if (res === null) return;
    try {
      // Grab the extid and the fields
      const { extid, fields } = res;
      // Override the activity
      overrideActivityValue([extid], _activityValue, activity);
      // Grab the label
      const labelField = fields[0].values[0];
      setExtIdPropsForObject(extid, { label: labelField });
    } catch (error) {
      onFailedExternalEditCallback();
    }
  };

  // On callback from action to select a different filter / select an object from filter in TEC
  const onProcessExternalActionWithFilterReturn = res => {
    if (res === null) return;
    // Map res to AM format
    try {
      // Override the activity
      overrideActivityValue(
        {
          extId: res.type,
          searchString: res.searchString || null,
          searchFields: res.searchFields || null,
          categories: mapCoreCategoryObjectToCategories(res.selectedCategories || [])
        },
        _activityValue,
        activity
      );
    } catch (error) {
      onFailedExternalEditCallback();
    }
  };

  // On callback from the completion of all external edits
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
        return onProcessExternalActionWithObjectReturn(res);
      case activityActions.SELECT_OBJECT_FROM_FILTER_OVERRIDE:
        return onProcessExternalActionWithObjectReturn(res);
      case activityActions.EDIT_FILTER_OVERRIDE:
        return onProcessExternalActionWithFilterReturn(res);
      default:
        break;
    }
  };

  // On callback to execute a selected action on the activity value from dropdown
  const onDispatchSelectedActivityValueAction = async action => {
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
  };

  // On handle click on dropdown menu item
  const onHandleDropdownMenuItemClick = ({ key }) => {
    onUpdateDropdownVisibility(false);
    onDispatchSelectedActivityValueAction(key);
  };

  return (
    <Dropdown
      overlay={(
        <Menu onClick={onHandleDropdownMenuItemClick}>
          {(validActivityValueActions || []).map(action => (
            <Menu.Item key={action}>{activityActionLabels[action]}</Menu.Item>
          ))}
        </Menu>
      )}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      visible={isDropdownVisible}
      onVisibleChange={onUpdateDropdownVisibility}
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
          />
        )}
        <ModalEdit
          activityValue={_activityValue}
          activity={activity}
          formatFn={formatFn}
          mappingProps={propertiesForMappedDesignValue}
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
