import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'antd';
import _ from 'lodash';

// COMPONENTS
import ObjectMapping from '../../../Components/ActivityDesigner/ObjectMapping';
import FieldMapping from '../../../Components/ActivityDesigner/FieldMapping';
import TimingMapping from '../../../Components/ActivityDesigner/TimingMapping';
import MappingStatus from '../../../Components/ActivityDesigner/MappingStatus';
import HasReservationsAlert from '../../../Components/ActivityDesigner/HasReservationsAlert';

// SELECTORS
import { selectForm } from '../../../Redux/Forms/forms.selectors';
import { makeSelectActivitiesForForm } from '../../../Redux/Activities/activities.selectors';
import {
  selectValidFieldsOnReservationMode,
  selectValidTypesOnReservationMode,
} from '../../../Redux/Integration/integration.selectors';
import { selectDesignForForm } from '../../../Redux/ActivityDesigner/activityDesigner.selectors';
import { createLoadingSelector } from '../../../Redux/APIStatus/apiStatus.selectors';

// HOOKS
import { useTECoreAPI } from '../../../Hooks/TECoreApiHooks';

// ACTIONS
import { updateDesign } from '../../../Redux/ActivityDesigner/activityDesigner.actions';
import {
  findTypesOnReservationMode,
  findFieldsOnReservationMode,
} from '../../../Redux/Integration/integration.actions';

// HELPERS
import {
  getElementsForMapping,
  getMandatoryPropsForTimingMode,
} from '../../../Redux/ActivityDesigner/activityDesigner.helpers';
import {
  extractReservationFields,
  extractReservationTypes,
  checkObjectIsInvalid,
  resetMenuOptions,
  resetEmpty,
  resetAll,
  resetTypes,
  resetFields,
  parseTypeOptions,
  parseFieldOptions,
  updateTimingPropOnActivityDesign,
  updateFieldPropOnActivityDesign,
  updateObjectPropOnActivityDesign,
} from '../../../Utils/activityDesigner';

// STYLES
import './activityDesigner.page.scss';

const ActivityDesignPage = () => {
  const { formId } = useParams();
  const teCoreAPI = useTECoreAPI();
  const dispatch = useDispatch();

  /**
   * SELECTORS
   */
  const form = useSelector(selectForm)(formId);
  const selectActivitiesForForm = useMemo(
    () => makeSelectActivitiesForForm(),
    [],
  );
  const activities = useSelector((state) =>
    selectActivitiesForForm(state, formId),
  );
  const validTypes = useSelector(selectValidTypesOnReservationMode)(
    form.reservationMode,
  );
  const validFields = useSelector(selectValidFieldsOnReservationMode)(
    form.reservationMode,
  );
  const storeDesign = useSelector(selectDesignForForm)(formId);
  const isSaving = useSelector(
    createLoadingSelector(['UPDATE_MAPPING_FOR_FORM']),
  );
  /**
   * STATE VARS
   */
  const [design, setDesign] = useState(storeDesign);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);

  /**
   * EFFECTS
   */
  useEffect(() => {
    if (form && form.reservationMode) {
      dispatch(findTypesOnReservationMode(form.reservationMode));
      dispatch(findFieldsOnReservationMode(form.reservationMode));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function execTypes() {
      const _availableTypes = await teCoreAPI.getReservationTypes();
      setAvailableTypes(extractReservationTypes(_availableTypes));
    }
    async function execFields() {
      const _availableFields = await teCoreAPI.getReservationFields();
      setAvailableFields(extractReservationFields(_availableFields));
    }
    execTypes();
    execFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * MEMOIZED VARS
   */
  const hasReservations = useMemo(
    () =>
      (Object.keys(activities || {}) || []).reduce(
        (number, formInstanceId) =>
          number + (activities[formInstanceId].length || 0),
        0,
      ) > 0,
    [activities],
  );

  const mappingOptions = useMemo(
    () => getElementsForMapping(form.sections, design),
    [form, design],
  );
  const typeOptions = useMemo(
    () => parseTypeOptions(validTypes, availableTypes),
    [validTypes, availableTypes],
  );
  const fieldOptions = useMemo(
    () => parseFieldOptions(validFields, availableFields),
    [validFields, availableFields],
  );

  const designIsValid = useMemo(() => {
    const { fields, objects, timing } = design;
    const mandatoryTimingFields = getMandatoryPropsForTimingMode(timing.mode);
    if (
      !mandatoryTimingFields ||
      mandatoryTimingFields.some((field) => _.isEmpty(timing[field]))
    )
      return false;
    if (checkObjectIsInvalid(fields)) return false;
    if (checkObjectIsInvalid(objects)) return false;
    return true;
  }, [design]);

  /**
   * EVENT HANDLERS
   */

  // Event handlers for updating the various props on the design
  const updateTimingDesignCallback = (prop, value) =>
    setDesign(updateTimingPropOnActivityDesign(design, formId, prop, value));
  const updateObjectDesignCallback = (objectDesign) =>
    setDesign(updateObjectPropOnActivityDesign(design, formId, objectDesign));
  const updateFieldDesignCallback = (fieldDesign) =>
    setDesign(updateFieldPropOnActivityDesign(design, formId, fieldDesign));

  // Callback to save mapping
  const onSaveDesign = () => {
    if (designIsValid) dispatch(updateDesign(design));
  };

  // Callback for reset meun clicks
  const onResetMenuClick = useCallback(
    ({ key }) => {
      switch (key) {
        case resetMenuOptions.RESET_EMPTY:
          return setDesign({
            ...resetEmpty(),
            formId,
            name: `Mapping for ${formId}`,
          });
        case resetMenuOptions.RESET_ALL:
          return setDesign({
            ...resetAll(typeOptions, fieldOptions),
            formId,
            name: `Mapping for ${formId}`,
          });
        case resetMenuOptions.RESET_TYPES:
          return setDesign({
            ...resetTypes(design, typeOptions),
            formId,
            name: `Mapping for ${formId}`,
          });
        case resetMenuOptions.RESET_FIELDS:
          return setDesign({
            ...resetFields(design, fieldOptions),
            formId,
            name: `Mapping for ${formId}`,
          });
        default:
          break;
      }
    },
    [formId, typeOptions, fieldOptions, design],
  );

  const resetMenu = (
    <Menu onClick={onResetMenuClick}>
      <Menu.Item key={resetMenuOptions.RESET_EMPTY}>Reset to empty</Menu.Item>
      {form.reservationMode && (
        <Menu.Item key={resetMenuOptions.RESET_ALL}>
          Reset to reservation mode
        </Menu.Item>
      )}
      {form.reservationMode && (
        <Menu.Item key={resetMenuOptions.RESET_TYPES}>
          Reset types to reservation mode
        </Menu.Item>
      )}
      {form.reservationMode && (
        <Menu.Item key={resetMenuOptions.RESET_FIELDS}>
          Reset fields to reservation mode
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      <div className='activity-designer--wrapper'>
        <div className='activity-designer--toolbar'>
          <div className='activity-designer__toolbar--label'>
            Reservation mode:
          </div>
          <div className='activity-designer__toolbar--value'>
            {form.reservationMode || 'Not selected'}
          </div>
          <Dropdown
            overlay={resetMenu}
            trigger={['click']}
            getPopupContainer={() => document.getElementById('te-prefs-lib')}
          >
            <Button type='link' size='small'>
              Reset configuration...
            </Button>
          </Dropdown>
          <div style={{ marginLeft: 'auto', display: 'flex' }}>
            <MappingStatus status={designIsValid} />
            <Button
              type='primary'
              size='small'
              onClick={onSaveDesign}
              loading={isSaving}
              disabled={!designIsValid}
            >
              Save
            </Button>
          </div>
        </div>
        {hasReservations && <HasReservationsAlert formId={formId} />}
        <div className='activity-designer--type-header'>
          <div>Timing</div>
          <div>Mapping</div>
        </div>
        <div className='activity-designer--list'>
          <TimingMapping
            mapping={design}
            onChange={updateTimingDesignCallback}
            formSections={form.sections}
            disabled={hasReservations}
          />
        </div>
        <div className='activity-designer--type-header'>
          <div>Type</div>
          <div>Mapping</div>
        </div>
        <div className='activity-designer--list'>
          <ObjectMapping
            mapping={design}
            mappingOptions={mappingOptions}
            typeOptions={typeOptions}
            onChange={updateObjectDesignCallback}
            disabled={hasReservations}
          />
        </div>
        <div className='activity-designer--type-header'>
          <div>Field</div>
          <div>Mapping</div>
        </div>
        <div className='activity-designer--list'>
          <FieldMapping
            mapping={design}
            mappingOptions={mappingOptions}
            fieldOptions={fieldOptions}
            onChange={updateFieldDesignCallback}
            disabled={hasReservations}
          />
        </div>
      </div>
    </>
  );
};

export default ActivityDesignPage;
