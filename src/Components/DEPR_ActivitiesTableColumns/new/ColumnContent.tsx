import { useRef, useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { notification, Menu, Dropdown } from 'antd';

// STYLES
import './ColumnContent.scss';

// COMPONENTS
import BaseActivityColValue from '../ActivityValueColumns/Base/BaseActivityColValue';
import InlineEdit from '../../ActivityEditing/InlineEdit';
import ModalEdit from '../../ActivityEditing/ModalEdit';

// REDUX
import { setExtIdPropsForObject } from '../../../Redux/TE/te.actions';
import { setExternalAction } from '../../../Redux/GlobalUI/globalUI.actions';
import { updateActivityValue, revertActivityValue } from 'Redux/Activities';

// HELPERS
import {
  getMappingSettingsForProp,
  getMappingTypeForProp,
} from '../../../Redux/ActivityDesigner/activityDesigner.helpers';

import {
  getNormalizedActivityValue,
  resetView,
  mapCoreCategoryObjectToCategories,
} from '../../DEPR_ActivitiesTableColumns/ActivityValueColumns/Helpers/helpers';

// CONSTANTS
import {
  activityActions,
  activityActionFilters,
  activityActionViews,
  externalActivityActionMapping,
  activityActionLabels,
} from '../../../Constants/activityActions.constants';
import { activityViews } from '../../../Constants/activityViews.constants';
import {
  activityIsReadOnly,
  findObjectPathForActivityValue,
} from '../../../Utils/activities.helpers';
import { useTECoreAPI } from 'Hooks/TECoreApiHooks';
import { ActivityValue } from 'Types/Activity/ActivityValue.type';
import { TActivity } from 'Types/Activity/Activity.type';

type Props = {
  activityValue?: ActivityValue;
  activity: TActivity;
  prop?: any;
  type?: any;
  propTitle?: any;
  formatFn?: any;
  mapping?: any;
  readonly?: any;
};

const ColumnContent = ({
  activityValue,
  activity,
  prop: typeExtId,
  type,
  propTitle,
  formatFn,
  mapping: design,
  readonly,
}: Props) => {
  const dispatch = useDispatch();
  const spotlightedElRef = useRef(null);

  const teCoreAPI = useTECoreAPI();

  // Activity value
  const _activityValue = getNormalizedActivityValue(
    activityValue,
    activity,
    type,
    typeExtId,
  );

  /**
   * STATE
   */
  // Component's view mode
  const [viewProps, setViewProps] = useState({
    view: activityViews.VALUE_VIEW,
    action: null,
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
      type: getMappingTypeForProp(_activityValue.extId, design),
    };
  }, [_activityValue, design]);

  // Valid dropdown actions for the activity value
  const validActivityValueActions = useMemo(() => {
    const actions = activityIsReadOnly(activity.activityStatus)
      ? [activityActions.SHOW_INFO]
      : Object.keys(activityActions);
    return actions.filter((activityAction) =>
      activityActionFilters[activityAction](_activityValue, activity, design),
    );
  }, [_activityValue, activity, design]);

  /**
   * EVENT HANDLERS
   */
  const overrideActivityValue = useCallback(
    (value: any) => {
      const activityValueType = findObjectPathForActivityValue(
        _activityValue.extId,
        activity,
      );
      if (
        !activityValueType ||
        !['timing', 'values'].includes(activityValueType)
      )
        return;
      dispatch(
        updateActivityValue({
          formId: activity.formId,
          activityId: activity._id,
          activityValueType: activityValueType,
          activityValueExtId: _activityValue.extId,
          updatedValue: value,
        }),
      );
    },
    [_activityValue, activity, dispatch],
  );

  const revertToSubmissionValue = () => {
    const activityValueType = findObjectPathForActivityValue(
      _activityValue.extId,
      activity,
    );

    if (
      !activityValueType ||
      !['timing', 'values'].includes(activityValueType)
    ) return;

    dispatch(
      revertActivityValue({
        formId: activity.formId,
        activityId: activity._id,
        activityValueType: activityValueType,
        activityValueExtId: _activityValue.extId,
      }),
    );
  };

  // On update dropdown visibility state
  const onUpdateDropdownVisibility = (vis) => {
    if (viewProps.view === activityViews.MODAL_EDIT)
      return setIsDropdownVisible(false);
    return setIsDropdownVisible(vis);
  };

  // On callback from manual editing
  const onFinishManualEditing = useCallback(
    (value: any) => {
      overrideActivityValue(value);
      setViewProps(resetView());
    },
    [overrideActivityValue, setViewProps],
  );

  // On failed callback from external edit action
  const onFailedExternalEditCallback = () =>
    notification.error({
      getContainer: () =>
        document.getElementById('te-prefs-lib') as HTMLElement,
      message: 'Operation failed',
      description: 'Something went wrong...',
    });

  // On callback from actions EDIT_OBJECT, SELECT_OBJECT_FROM_FILTER_OVERRIDE
  const onProcessExternalActionWithObjectReturn = (res) => {
    if (res === null) return;
    try {
      // Grab the extid and the fields
      const { extid, fields } = res;
      // Override the activity
      overrideActivityValue([extid]);
      // Grab the label
      const labelField = fields[0].values[0];
      setExtIdPropsForObject(extid, { label: labelField });
    } catch (error) {
      onFailedExternalEditCallback();
    }
  };

  // On callback from action to select a different filter / select an object from filter in TEC
  const onProcessExternalActionWithFilterReturn = (res) => {
    if (res === null) return;
    // Map res to AM format
    try {
      // Override the activity
      overrideActivityValue({
        extId: res.type,
        searchString: res.searchString || null,
        searchFields: res.searchFields || null,
        categories: mapCoreCategoryObjectToCategories(
          res.selectedCategories || [],
        ),
      });
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
  const onDispatchSelectedActivityValueAction = async (action) => {
    /**
     * Most actions change the view props
     * but revert to submission value has no view impact
     * so we test for it first
     */
    if (action === activityActions.REVERT_TO_SUBMISSION_VALUE) {
      revertToSubmissionValue();
      return;
    }

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
        objectExtId: activityValue?.value,
        typeExtId: activityValue?.extId,
        callback: (res) => onFinshExternalEdit(res, action),
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

  const memoizedRender = useMemo(() => {
    switch (viewProps.view) {
      case activityViews.INLINE_EDIT:
        return (
          <InlineEdit
            onFinish={onFinishManualEditing}
            onCancel={() => setViewProps(resetView())}
            activityValue={_activityValue}
            activity={activity}
            action={viewProps.action as unknown as string}
          />
        );
      case activityViews.VALUE_VIEW:
        return (
          <BaseActivityColValue
            activityValue={_activityValue}
            activity={activity}
          />
        );
      case activityViews.MODAL_EDIT:
        return (
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
        );
      default:
        return null;
    }
  }, [
    _activityValue,
    activity,
    formatFn,
    onFinishManualEditing,
    propTitle,
    propertiesForMappedDesignValue,
    typeExtId,
    viewProps.action,
    viewProps.view,
  ]);

  if (readonly) {
    return (
      <div className={'column-content--wrapper'} ref={spotlightedElRef}>
        {memoizedRender}
      </div>
    );
  }
  return (
    <Dropdown
      overlay={
        <Menu onClick={onHandleDropdownMenuItemClick}>
          {(validActivityValueActions || []).map((action) => (
            <Menu.Item key={action}>{activityActionLabels[action]}</Menu.Item>
          ))}
        </Menu>
      }
      getPopupContainer={() =>
        document.getElementById('te-prefs-lib') as HTMLElement
      }
      visible={isDropdownVisible}
      onVisibleChange={onUpdateDropdownVisibility}
      trigger={['hover']}
    >
      <div className={'column-content--wrapper'} ref={spotlightedElRef}>
        {memoizedRender}
      </div>
    </Dropdown>
  );
};

export default ColumnContent;
