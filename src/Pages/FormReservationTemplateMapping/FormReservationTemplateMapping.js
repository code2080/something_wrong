import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Button, Modal } from 'antd';
import ReactRouterPause from '@allpro/react-router-pause';

// COMPONENTS
import withTECoreAPI from '../../Components/TECoreAPI/withTECoreAPI';
import ObjectMapping from '../../Components/ReservationTemplateMapping/ObjectMapping';
import FieldMapping from '../../Components/ReservationTemplateMapping/FieldMapping';
import TimingMapping from '../../Components/ReservationTemplateMapping/TimingMapping';

// ACTIONS
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { updateMapping } from '../../Redux/ReservationTemplateMapping/reservationTemplateMapping.actions';
import { deleteActivities } from '../../Redux/Activities/activities.actions';

// HELPERS
import {
  validateMapping,
  getElementsForMapping,
} from '../../Redux/ReservationTemplateMapping/reservationTemplateMapping.helpers';

// STYLES
import './FormReservationTemplateMapping.scss';
import { ReservationTemplateMapping } from '../../Models/ReservationTemplateMapping.model';

// CONSTANTS
import { mappingStatuses } from '../../Constants/mappingStatus.constants';

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId } } } = ownProps;
  const activities = state.activities[formId];
  const noOfReservations = (Object.keys(activities) || []).reduce(
    (number, formInstanceId) => number + (activities[formInstanceId].length || 0),
    0
  );

  return {
    formId,
    form: state.forms[formId],
    mappings: state.mappings,
    mapping: state.mappings[formId],
    hasReservations: noOfReservations > 0,
  };
};

const mapActionsToProps = {
  setBreadcrumbs,
  updateMapping,
  deleteActivities,
};

const extractReservationTypes = payload => {
  if (!payload.subtypes || !payload.subtypes.length) return [];
  return payload.subtypes.map(el => ({ label: el.name, value: el.extid }));
};

const extractReservationFields = payload =>
  payload.map(el => ({ label: el.name, value: el.extid }));

const FormReservationTemplateMapping = ({
  form,
  formId,
  mapping,
  mappings,
  hasReservations,
  setBreadcrumbs,
  updateMapping,
  deleteActivities,
  teCoreAPI,
}) => {
  // State vars
  const [reservationTypes, setReservationTypes] = useState(null);
  const [reservationFields, setReservationFields] = useState(null);
  const navigationHandler = (navigation, location, action) => {
    Modal.confirm({
      getContainer: () => document.getElementById('te-prefs-lib'),
      title: 'Mapping is incomplete',
      content: 'Are you sure you want to leave the page?',
      onOk: () => navigation.resume(),
      onCancel: () => navigation.cancel(),
    })
    return null;
  };

  // Effect to set breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formId}`, label: form.name },
      { path: `/forms/${formId}/mapping`, label: `Activity designer` }
    ]);
  }, []);

  // Effect to set activity types
  useEffect(() => {
    async function exec() {
      const _reservationTypes = await teCoreAPI.getReservationTypes();
      setReservationTypes(extractReservationTypes(_reservationTypes));
    }
    exec();
  }, []);

  // Effect to set activity fields
  useEffect(() => {
    async function exec() {
      const _reservationFields = await teCoreAPI.getReservationFields();
      setReservationFields(extractReservationFields(_reservationFields));
    }
    exec();
  }, []);

  // Memoized mapping options
  const mappingOptions = useMemo(() => getElementsForMapping(form.sections, mapping), [form, mapping]);
  const mappingStatus = useMemo(() => validateMapping(form._id, mappings), [form, mappings]);

  // Callback to delete any existing activities
  const onDeleteReservationsCallback = useCallback(() => {
    deleteActivities(formId);
  }, [formId, deleteActivities]);

  // Callback to update the timing section of the mapping
  const updateTimingMappingCallback = useCallback((timingProp, value) => {
    const updatedMapping = new ReservationTemplateMapping({
      ...mapping,
      formId: formId,
      name: `Mapping for ${form.name}`,
      timing: {
        ...mapping.timing,
        [timingProp]: value,
      },
    });
    updateMapping(updatedMapping);
  }, [formId, form, updateMapping, mapping]);

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
    updateMapping(updatedMapping);
  }, [updateMapping, mapping, formId, form]);

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
    updateMapping(updatedMapping);
  }, [updateMapping, mapping, formId, form]);

  return (
    <React.Fragment>
      <ReactRouterPause
        handler={navigationHandler}
        when={mappingStatus === mappingStatuses.NOT_SET}
        config={{ allowBookmarks: false }}
      />
      <div className="form-activity-template-mapping--wrapper">
        <div className="form-activity-template-mapping--header">
          {`Configure the mapping for form ${form.name}`}
        </div>
        {hasReservations && (
          <Alert
            className="form-activity-template-mapping--alert"
            type="warning"
            message="Editing mapping will delete activities"
            description={(
              <React.Fragment>
                <div>
                  One or many submissions have already been converted to activities with the current mapping. To edit the mapping you must first delete the activities.
                </div>
                <Button size="small" type="link" onClick={onDeleteReservationsCallback}>Delete activities now</Button>
              </React.Fragment>
            )}
          />
        )}
        <div className="form-activity-template-mapping--type-header">
          <div>Timing</div>
          <div>Mapping</div>
        </div>
        <div className="form-activity-template-mapping--list">
          <TimingMapping
            mapping={mapping}
            onChange={updateTimingMappingCallback}
            formSections={form.sections}
            disabled={hasReservations}
          />
        </div>
        <div className="form-activity-template-mapping--type-header">
          <div>Object</div>
          <div>Mapping</div>
        </div>
        <div className="form-activity-template-mapping--list">
          <ObjectMapping
            mapping={mapping}
            mappingOptions={mappingOptions}
            typeOptions={reservationTypes}
            onChange={updateObjectMappingCallback}
            disabled={hasReservations}
          />
        </div>
        <div className="form-activity-template-mapping--type-header">
          <div>Field</div>
          <div>Mapping</div>
        </div>
        <div className="form-activity-template-mapping--list">
          <FieldMapping
            mapping={mapping}
            mappingOptions={mappingOptions}
            fieldOptions={reservationFields}
            onChange={updateFieldMappingCallback}
            disabled={hasReservations}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

FormReservationTemplateMapping.propTypes = {
  form: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  mapping: PropTypes.object,
  mappings: PropTypes.object,
  hasReservations: PropTypes.bool.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  updateMapping: PropTypes.func.isRequired,
  deleteActivities: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
};

FormReservationTemplateMapping.defaultProps = {
  mapping: {},
  mappings: {},
};

export default withTECoreAPI(connect(mapStateToProps, mapActionsToProps)(FormReservationTemplateMapping));
