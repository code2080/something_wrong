import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Menu, Dropdown, Button, Modal } from 'antd';
import _ from 'lodash';

// COMPONENTS
import ObjectMapping from '../../../../Components/ActivityDesigner/ObjectMapping';
import FieldMapping from '../../../../Components/ActivityDesigner/FieldMapping';
import TimingMapping from '../../../../Components/ActivityDesigner/TimingMapping';
import MappingStatus from '../../../../Components/ActivityDesigner/MappingStatus';
import AdditionalFields from 'Components/ActivityDesigner/AdditionalFields';

// REDUX
import { selectElementTypesMap } from '../../../../Redux/Elements/element.selectors';
import {
  updateDesign,
  unlockActivityDesigner,
} from '../../../../Redux/ActivityDesigner/activityDesigner.actions';
import {
  findTypesOnReservationMode,
  findFieldsOnReservationMode,
} from '../../../../Redux/Integration/integration.actions';
import {
  makeSelectActivitiesForForm,
  activityInWorkerProgressSelector,
} from '../../../../Redux/DEPR_Activities/activities.selectors';
import {
  selectValidFieldsOnReservationMode,
  selectValidTypesOnReservationMode,
} from '../../../../Redux/Integration/integration.selectors';
import { selectDesignForForm } from '../../../../Redux/ActivityDesigner/activityDesigner.selectors';
import { createLoadingSelector } from '../../../../Redux/APIStatus/apiStatus.selectors';
import { formSelector } from '../../../../Redux/Forms';

// MODELS
import { ActivityDesign } from '../../../../Models/ActivityDesign.model';

// HOOKS
import { useTECoreAPI } from '../../../../Hooks/TECoreApiHooks';
import { ConfirmLeavingPageContext } from '../../../../Hooks/ConfirmLeavingPageContext';

// HELPERS
import {
  getElementsForMapping,
  getMandatoryPropsForTimingMode,
} from '../../../../Redux/ActivityDesigner/activityDesigner.helpers';
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
} from '../../../../Utils/activityDesigner';

// STYLES
import './index.scss';
import { resetState } from 'Redux/Activities';

const ActivityDesignPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const teCoreAPI = useTECoreAPI();
  const dispatch = useDispatch();
  const leavingPageContext: any = useContext(ConfirmLeavingPageContext);

  /**
   * SELECTORS
   */
  const form = useSelector(formSelector(formId));
  const selectActivitiesForForm = useMemo(
    () => makeSelectActivitiesForForm(),
    [],
  );
  const activities = useSelector((state) =>
    selectActivitiesForForm(state, formId as string),
  );

  const validTypes = useSelector(selectValidTypesOnReservationMode)(
    form?.reservationMode,
  );
  const validFields = useSelector(selectValidFieldsOnReservationMode)(
    form?.reservationMode,
  );
  const storeDesign = useSelector(selectDesignForForm)(formId as string);
  const isSaving = useSelector(
    createLoadingSelector(['UPDATE_MAPPING_FOR_FORM']),
  );
  const elementsMapping = useSelector(selectElementTypesMap());
  const hasActivitiesInProgress = useSelector(activityInWorkerProgressSelector)(
    formId as string,
  );
  /**
   * STATE VARS
   */
  const [design, setActivityDesign] = useState(storeDesign);
  const setDesign = (activityDesign) =>
    setActivityDesign(new ActivityDesign(activityDesign));
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const designRef = useRef();

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
  const hasActivities = useMemo(
    () =>
      (Object.keys(activities || {}) || []).reduce(
        (number, formInstanceId) =>
          number + (activities[formInstanceId].length || 0),
        0,
      ) > 0,
    [activities],
  );

  const isEditable = useMemo(() => storeDesign.isEditable, [storeDesign]);

  const mappingOptions = useMemo(
    () =>
      getElementsForMapping({
        formSections: form?.sections || [],
        mapping: design,
        settings: {
          primaryObject: form?.objectScope,
          elementsMapping,
        },
      }),
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

  useEffect(() => {
    designRef.current = design;
  }, [design]);

  // init the reservation mode as the default value
  useEffect(() => {
    if (!storeDesign.formId && !storeDesign.name) {
      setDesign(resetAll(typeOptions, fieldOptions));
    }
  }, [typeOptions, fieldOptions, storeDesign]);

  /**
   * EVENT HANDLERS
   */

  // Callback to save mapping
  const onSaveDesign = () => {
    if (designIsValid) {
      dispatch(updateDesign(designRef.current));
      leavingPageContext.setIsModified(false);
      dispatch(resetState());
    }
  };

  // Event handlers for updating the various props on the design
  const updateTimingDesignCallback = (prop, value) => {
    setDesign(updateTimingPropOnActivityDesign(design, formId, prop, value));
    leavingPageContext.setIsModified(true);
    leavingPageContext.setExecuteFuncBeforeLeave(() => onSaveDesign);
  };
  const updateObjectDesignCallback = (objectDesign) => {
    setDesign(updateObjectPropOnActivityDesign(design, formId, objectDesign));
    leavingPageContext.setIsModified(true);
    leavingPageContext.setExecuteFuncBeforeLeave(() => onSaveDesign);
  };
  const updateFieldDesignCallback = (fieldDesign) => {
    setDesign(updateFieldPropOnActivityDesign(design, formId, fieldDesign));
    leavingPageContext.setIsModified(true);
    leavingPageContext.setExecuteFuncBeforeLeave(() => onSaveDesign);
  };

  const onUpdateDesign = (dataToUpdate) => {
    setDesign({ ...design, ...dataToUpdate });
    leavingPageContext.setIsModified(true);
    leavingPageContext.setExecuteFuncBeforeLeave(() => onSaveDesign);
  };

  const onUnlockClick = () => {
    Modal.confirm({
      getContainer: () =>
        document.getElementById('te-prefs-lib') as HTMLElement,
      title: 'Unlock activity design',
      content:
        'After saving your new design, all existing activities and any corresponding reservations will be deleted. Are you sure you want to proceed?',
      onOk: () => {
        dispatch(unlockActivityDesigner({ formId }));
        leavingPageContext.setIsModified(true);
      },
    });
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
      {form?.reservationMode && (
        <Menu.Item key={resetMenuOptions.RESET_ALL}>
          Reset to reservation mode
        </Menu.Item>
      )}
      {form?.reservationMode && (
        <Menu.Item key={resetMenuOptions.RESET_TYPES}>
          Reset types to reservation mode
        </Menu.Item>
      )}
      {form?.reservationMode && (
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
            {form?.reservationMode || 'Not selected'}
          </div>
          <Dropdown
            overlay={resetMenu}
            trigger={['click']}
            getPopupContainer={() =>
              document.getElementById('te-prefs-lib') as HTMLElement
            }
            disabled={hasActivities || !isEditable}
          >
            <Button type='link' size='small'>
              Reset configuration...
            </Button>
          </Dropdown>
          <div style={{ marginLeft: 'auto', display: 'flex' }}>
            <MappingStatus status={designIsValid} />
            {!isEditable ? (
              <Button
                type='primary'
                size='small'
                onClick={onUnlockClick}
                loading={isSaving}
                disabled={hasActivities || hasActivitiesInProgress}
              >
                Unlock
              </Button>
            ) : (
              <Button
                type='primary'
                size='small'
                onClick={onSaveDesign}
                loading={isSaving}
                disabled={!designIsValid || hasActivities || !isEditable}
              >
                Save
              </Button>
            )}
          </div>
        </div>
        <div className='activity-designer--type-header'>
          <div>Timing</div>
          <div>Mapping</div>
        </div>
        <div className='activity-designer--list'>
          <TimingMapping
            mapping={design}
            onChange={updateTimingDesignCallback}
            formSections={form?.sections || []}
            disabled={hasActivities || !isEditable}
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
            disabled={hasActivities || !isEditable}
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
            disabled={hasActivities || !isEditable}
          />
        </div>

        <div className='activity-designer--type-header'>
          <div>Additional fields</div>
          <div>Mapping</div>
        </div>
        <div className='activity-designer--list'>
          <AdditionalFields
            mapping={design}
            mappingOptions={mappingOptions}
            onChange={(activityType) =>
              onUpdateDesign({
                additionalFields: {
                  ...design.additionalFields,
                  activityType,
                },
              })
            }
            disabled={hasActivities || !isEditable}
          />
        </div>
      </div>
    </>
  );
};

export default ActivityDesignPage;
