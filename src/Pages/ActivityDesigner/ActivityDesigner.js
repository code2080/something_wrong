import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Alert, Button, Modal, Menu, Dropdown } from 'antd';
import ReactRouterPause from '@allpro/react-router-pause';

// COMPONENTS
import withTECoreAPI from '../../Components/TECoreAPI/withTECoreAPI';
import ObjectMapping from '../../Components/ActivityDesigner/ObjectMapping';
import FieldMapping from '../../Components/ActivityDesigner/FieldMapping';
import TimingMapping from '../../Components/ActivityDesigner/TimingMapping';
import SavingStatus from '../../Components/ActivityDesigner/SavingStatus';
import MappingStatus from '../../Components/ActivityDesigner/MappingStatus';

// ACTIONS
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { updateMapping } from '../../Redux/ActivityDesigner/activityDesigner.actions';
import { deleteActivities } from '../../Redux/Activities/activities.actions';
import { findTypesOnReservationMode, findFieldsOnReservationMode } from '../../Redux/Integration/integration.actions';

// HELPERS
import {
  validateMapping,
  getElementsForMapping,
  getMandatoryPropsForTimingMode,
} from '../../Redux/ActivityDesigner/activityDesigner.helpers';
import {
  extractReservationFields,
  extractReservationTypes,
  checkObjectIsInvalid,
  resetMenuOptions,
  resetEmpty,
  resetAll,
  resetTypes,
  resetFields,
} from '../../Utils/activityDesigner';

// STYLES
import './ActivityDesigner.scss';
import { ActivityDesignerMapping } from '../../Models/ActivityDesignerMapping.model';

// CONSTANTS
import { mappingStatuses } from '../../Constants/mappingStatus.constants';
import { useHistory } from 'react-router-dom';

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId } } } = ownProps;
  const activities = state.activities[formId];
  const noOfReservations = (Object.keys(activities) || []).reduce(
    (number, formInstanceId) => number + (activities[formInstanceId].length || 0),
    0
  );
  const form = state.forms[formId];
  let validTypes = [];
  let validFields = [];
  const { reservationMode } = form;
  if (reservationMode) {
    validTypes = _.get(state, `integration.reservationModes.${reservationMode}.types`, []);
    validFields = _.get(state, `integration.reservationModes.${reservationMode}.fields`, []);
  }

  return {
    form,
    formId,
    mappings: state.activityDesigner,
    mappingOriginal: state.activityDesigner[formId],
    hasReservations: noOfReservations > 0,
    validTypes,
    validFields,
  };
};

const mapActionsToProps = {
  setBreadcrumbs,
  updateMapping,
  deleteActivities,
  findTypesOnReservationMode,
  findFieldsOnReservationMode,
};

const ActivityDesignerPage = ({
  form,
  formId,
  mappingOriginal,
  mappings,
  hasReservations,
  validTypes,
  validFields,
  setBreadcrumbs,
  updateMapping,
  deleteActivities,
  findTypesOnReservationMode,
  findFieldsOnReservationMode,
  teCoreAPI,
  saving,
}) => {
  const history = useHistory();
  /**
   * STATE VARS
   */
  const [mapping, setMapping] = useState(mappingOriginal);

  /**
   * EFFECTS
   */

  useEffect(() => {
    if (form && form.reservationMode) {
      findTypesOnReservationMode(form.reservationMode);
      findFieldsOnReservationMode(form.reservationMode);
    }
  }, []);

  const navigationHandler = (navigation) => {
    Modal.confirm({
      getContainer: () => document.getElementById('te-prefs-lib'),
      title: 'The activity design is incomplete',
      content: 'Are you sure you want to leave the page?',
      onOk: () => navigation.resume(),
      onCancel: () => navigation.cancel(),
    })
    return null;
  };

  // State vars
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);

  // Effect to set breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formId}`, label: form.name },
      { path: `/forms/${formId}/activity-designer`, label: `Activity designer` }
    ]);
  }, []);

  // Effect to set activity types & fields
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
  }, []);

  /**
   * MEMOIZED VARS
   */
  const mappingOptions = useMemo(() => getElementsForMapping(form.sections, mapping), [form, mapping]);
  const mappingStatus = useMemo(() => validateMapping(form._id, mappings), [form, mappings]);
  const typeOptions = useMemo(() => {
    if (validTypes.length > 0)
      return validTypes.map(
        value => ({
          value,
          label: (availableTypes.find(el => el.value === value) || { label: value }).label,
        })
      );
    return availableTypes;
  }, [form, validTypes, availableTypes]);

  const fieldOptions = useMemo(() => {
    if (validFields.length > 0)
      return validFields.map(
        value => ({
          value,
          label: (availableFields.find(el => el.value === value) || { label: value }).label,
        })
      );
    return availableFields;
  }, [validFields, availableFields]);

  /**
   * EVENT HANDLERS
   */
  // Callback to delete any existing activities
  const onDeleteReservationsCallback = useCallback(() => {
    const doDelete = async () => {
      await deleteActivities(formId);
      history.goBack();
    }
    doDelete();
  }, [formId, deleteActivities]);

  // Callback to update the timing section of the mapping
  const updateTimingMappingCallback = useCallback((timingProp, value) => {
    const updatedMapping = new ActivityDesignerMapping({
      ...mapping,
      formId: formId,
      name: `Mapping for ${form.name}`,
      timing: {
        ...mapping.timing,
        [timingProp]: value,
      },
    });
    setMapping(updatedMapping);
  }, [formId, form, setMapping, mapping]);

  // Callback to update the object section of the mapping
  const updateObjectMappingCallback = useCallback(_mapping => {
    const updatedMapping = {
      ...mapping,
      formId: formId,
      name: `Mapping for ${form.name}`,
      objects: {
        ..._mapping.objects,
      },
      propSettings: {
        ..._mapping.propSettings,
      },
    };
    setMapping(updatedMapping);
  }, [setMapping, mapping, formId, form]);

  // Callback to update the field section of the mapping
  const updateFieldMappingCallback = useCallback(_mapping => {
    const updatedMapping = {
      ...mapping,
      formId: formId,
      name: `Mapping for ${form.name}`,
      fields: {
        ..._mapping.fields,
      },
      propSettings: {
        ..._mapping.propSettings,
      },
    };
    setMapping(updatedMapping);
  }, [setMapping, mapping, formId, form]);

  // Callback for reset mapping update
  const onResetMapping = resetMapping => {
    setMapping({
      ...resetMapping,
      formId: formId,
      name: `Mapping for ${form.name}`,
    });
  };

  const mappingIsValid = useMemo(() => {
    const { fields, objects, timing } = mapping;
    const mandatoryTimingFields = getMandatoryPropsForTimingMode(timing.mode);
    console.log(mandatoryTimingFields);
    if (!mandatoryTimingFields || mandatoryTimingFields.some(field => _.isEmpty(timing[field]))) {
      console.log('Timing invalid');
      return false;
    }
    if (checkObjectIsInvalid(fields)) {
      console.log('Fields invalid');
      return false;
    }
    if (checkObjectIsInvalid(objects)) {
      console.log('Objects invalid');
      return false;
    }
    return true;
  }, [mapping]);

  useEffect(() => {
    if (mappingIsValid) {
      updateMapping(mapping);
    }
  }, [mappingIsValid, mapping]);

  // Callback for reset meun clicks
  const onResetMenuClick = useCallback(({ key }) => {
    switch (key) {
      case resetMenuOptions.RESET_EMPTY:
        return onResetMapping(resetEmpty());
      case resetMenuOptions.RESET_ALL:
        return onResetMapping(resetAll(typeOptions, fieldOptions));
      case resetMenuOptions.RESET_TYPES:
        return onResetMapping(resetTypes(mapping, typeOptions));
      case resetMenuOptions.RESET_FIELDS:
        return onResetMapping(resetFields(mapping, fieldOptions));
      default:
        break;
    }
  }, [mapping, typeOptions, fieldOptions]);

  const resetMenu = (
    <Menu onClick={onResetMenuClick}>
      <Menu.Item key={resetMenuOptions.RESET_EMPTY}>Reset to empty</Menu.Item>
      {form.reservationMode && <Menu.Item key={resetMenuOptions.RESET_ALL}>Reset to reservation mode</Menu.Item>}
      {form.reservationMode && <Menu.Item key={resetMenuOptions.RESET_TYPES}>Reset types to reservation mode</Menu.Item>}
      {form.reservationMode && <Menu.Item key={resetMenuOptions.RESET_FIELDS}>Reset fields to reservation mode</Menu.Item>}
    </Menu>
  );

  return (
    <React.Fragment>
      <ReactRouterPause
        handler={navigationHandler}
        when={mappingStatus === mappingStatuses.NOT_SET}
        config={{ allowBookmarks: false }}
      />
      <div className="activity-designer--wrapper">
        <div className="activity-designer--header">
          {`Configure the activity design for ${form.name}`}
        </div>
        {hasReservations && (
          <Alert
            className="activity-designer--alert"
            type="warning"
            message="Editing the configuration will delete existing activities"
            description={(
              <React.Fragment>
                <div>
                  One or many submissions have already been converted to activities with the current configuration. To edit the mapping you must first delete the activities.
                </div>
                <Button size="small" type="link" onClick={onDeleteReservationsCallback}>Delete activities now</Button>
              </React.Fragment>
            )}
          />
        )}
        <div className="activity-designer--toolbar">
          <div className="activity-designer__toolbar--label">Reservation mode:</div>
          <div className="activity-designer__toolbar--value">{form.reservationMode || 'Not selected'}</div>
          <Dropdown
            overlay={resetMenu}
            trigger={['click']}
            getPopupContainer={() => document.getElementById('te-prefs-lib')}
          >
            <Button type="link" size="small">
              Reset configuration...
            </Button>
          </Dropdown>
          <div style={{ marginLeft: 'auto', display: 'flex' }}>
            <MappingStatus status={mappingIsValid} />
            <SavingStatus />
          </div>
        </div>
        <div className="activity-designer--type-header">
          <div>Timing</div>
          <div>Mapping</div>
        </div>
        <div className="activity-designer--list">
          <TimingMapping
            mapping={mapping}
            onChange={updateTimingMappingCallback}
            formSections={form.sections}
            disabled={hasReservations}
          />
        </div>
        <div className="activity-designer--type-header">
          <div>Type</div>
          <div>Mapping</div>
        </div>
        <div className="activity-designer--list">
          <ObjectMapping
            mapping={mapping}
            mappingOptions={mappingOptions}
            typeOptions={typeOptions}
            onChange={updateObjectMappingCallback}
            disabled={hasReservations}
          />
        </div>
        <div className="activity-designer--type-header">
          <div>Field</div>
          <div>Mapping</div>
        </div>
        <div className="activity-designer--list">
          <FieldMapping
            mapping={mapping}
            mappingOptions={mappingOptions}
            fieldOptions={fieldOptions}
            onChange={updateFieldMappingCallback}
            disabled={hasReservations}
          />
        </div>
        <div className="activity-designer--list" style={{ textAlign: 'right' }}>
          <Button type="link" size="small" onClick={() => history.goBack()}>
            Close
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

ActivityDesignerPage.propTypes = {
  form: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  mappingOriginal: PropTypes.object,
  mappings: PropTypes.object,
  hasReservations: PropTypes.bool.isRequired,
  validFields: PropTypes.array,
  validTypes: PropTypes.array,
  setBreadcrumbs: PropTypes.func.isRequired,
  updateMapping: PropTypes.func.isRequired,
  deleteActivities: PropTypes.func.isRequired,
  findTypesOnReservationMode: PropTypes.func.isRequired,
  findFieldsOnReservationMode: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
  saving: PropTypes.bool,
};

ActivityDesignerPage.defaultProps = {
  mappingOriginal: {},
  mappings: {},
  validFields: [],
  validTypes: [],
  saving: false,
};

export default withTECoreAPI(connect(mapStateToProps, mapActionsToProps)(ActivityDesignerPage));
