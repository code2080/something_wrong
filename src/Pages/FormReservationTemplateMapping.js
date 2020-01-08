/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Button, Modal } from 'antd';
import _ from 'lodash';

// COMPONENTS
import withTECoreAPI from '../Components/TECoreAPI/withTECoreAPI';
import ObjectMapping from '../Components/ReservationTemplateMapping/ObjectMapping';
import FieldMapping from '../Components/ReservationTemplateMapping/FieldMapping';
import TimingMapping from '../Components/ReservationTemplateMapping/TimingMapping';

// ACTIONS
import { setBreadcrumbs } from '../Redux/GlobalUI/globalUI.actions';
import { createMapping, updateMapping } from '../Redux/Mapping/mappings.actions';
import { deleteReservations } from '../Redux/Reservations/reservations.actions';

// HELPERS
import {
  validateTemplateAgainstMapping,
  createNewMappingFromTemplate,
  getElementsForMapping,
} from '../Redux/Mapping/mappings.helpers';

// STYLES
import './FormReservationTemplateMapping.scss';

// CONSTANTS
const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId } } } = ownProps;
  const reservations = state.reservations[formId];
  const noOfReservations = (Object.keys(reservations) || []).reduce(
    (number, formInstanceId) => number + (reservations[formInstanceId].length || 0),
    0
  );

  return {
    formId,
    form: state.forms[formId],
    mappings: state.mappings[formId],
    hasReservations: noOfReservations > 0,
  };
};

const mapActionsToProps = {
  setBreadcrumbs,
  createMapping,
  updateMapping,
  deleteReservations,
};

/**
 * @todo
 * DONE x) Make sure you can only select one item from a repeating section
 * DONE x) Style mapping page
 * DONE x) Add event title as mappable field
 * DONE x) Add scoped object as mappable field
 * DONE x) Update label in SchedulingProgress component
 * DONE x) Create way to showcase scheduling in form instance (number of reservations, what do to)
 * DONE x) Save reservations to te preferences database
 * DONE x) Updates to mapping should delete all reservations
 * x) Add scoped objects to getExtIdProps
 * DONE x) Improve mapping data model to include mandatory and non mandatory properties, and update validation
 * DONE x) ConnectedSectionSchedulingColumn: Improvements
 *    DONE x) cross over entire row if section is scheduled
 *    DONE x) Scheduling button should trigger scheduling call
 * x) Reservation summary: Improvements
 *    x) Manual override: For values where filters have been selected -> teCoreAPI call to send filters and listen for object selection
 *    x) Manual override: For objects -> teCoreAPI call to send object type and let user select obect
 *    DONE x) Manual override: Highlight things that require manual override
 *    DONE x) Create new scheduling statuses -> NO_AVAILABILITY (for when either non-determined objects are unavailable) and FAILED (when determined objects are unavailable)
 *    DONE x) Highlight reservations that could not be scheduled
 *    DONE x) Build support for submissionValues with multiple options
 * x) TE Core API:
 *    DONE x) Create way to wrap API call in native function with Redux support
 *    x) Wrap scheduleReservation to store return value
 *    x) Create scheduleReservations call, wrapping around scheduleReservation and make multiple reservations at once
 * DONE x) Reservation data model: add timestamp for last status change / scheduling attempt
 * x) Create way to show if booking has changed, and to what extent the booking matched the preferences
 * DONE x) Create isLoading selector support
 * DONE x) ReservationTemplateMapping improvements
 *    DONE x) If validateTemplateAgainstMapping returns false, we should 1) show notification and 2) delete any reservations
 *    DONE x) Show required props
 * x) Connected and Table section improvements
 *    x) Make sure manual overrides are shown instead of original submission value
 */

const FormReservationTemplateMapping = ({
  form,
  formId,
  mappings,
  hasReservations,
  setBreadcrumbs,
  createMapping,
  updateMapping,
  deleteReservations,
  teCoreAPI,
}) => {
  // Store selected template and template definition
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDefinition, setTemplateDefinition] = useState(null);
  useEffect(() => {
    async function exec() {
      // Get the selected template name
      const selectedTemplate = await teCoreAPI.getSelectedReservationTemplate();
      setSelectedTemplate(selectedTemplate);
      // Get the template definition
      const templates = await teCoreAPI.getReservationTemplates();
      const templateIdx = (Object.keys(templates) || []).findIndex(key => key === selectedTemplate);
      const templateDefinition = templateIdx === -1 ? null : templates[Object.keys(templates)[templateIdx]]
      setTemplateDefinition(templateDefinition);
      // Check if we have a mapping for that template
      const mapping = mappings[selectedTemplate];
      if (!mapping) {
        // We don't have a mapping -> create it
        const mappingBase = createNewMappingFromTemplate(templateDefinition, selectedTemplate, formId);
        return createMapping(mappingBase);
      }
      // Validate our mapping's valid
      const isMappingValid = validateTemplateAgainstMapping(templateDefinition, mapping);
      if (!isMappingValid) {
        // Mapping is invalid -> show notification to user, delete any reservations, and create new mapping
        Modal.info({
          getContainer: () => document.getElementById('te-prefs-lib'),
          title: 'Reservation template updated',
          content: (
            <div>
              <p>The reservation template has been updated since the mapping was created.</p>
              <p>The mapping will be reset and all reservations on this form will be deleted.</p>
            </div>
          ),
          onOk: () => {
            // Delete reservations
            deleteReservations(formId);
            // Reset the mapping
            const mappingBase = { ...createNewMappingFromTemplate(templateDefinition, selectedTemplate, formId), _id: mapping._id };
            updateMapping(mappingBase);
          },
        });
      }
    }
    exec();
  }, []);

  const mappingOptions = getElementsForMapping(form.sections, mappings[selectedTemplate]);

  // Effect to update breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formId}`, label: form.name },
      { path: `/forms/${formId}/mapping`, label: `Reservation template mapping` }
    ]);
  }, []);

  // Callback to update mapping
  const updateTimingMappingCallback = useCallback((timingProp, value) => {
    if (mappings[selectedTemplate]) {
      const mapping = {
        ...mappings[selectedTemplate],
        timing: {
          ...mappings[selectedTemplate].timing,
          [timingProp]: value,
        },
      };
      updateMapping(mapping);
    }
  }, [updateMapping, mappings, selectedTemplate]);
  const updateObjectMappingCallback = useCallback((objectType, value) => {
    if (mappings[selectedTemplate]) {
      const mapping = {
        ...mappings[selectedTemplate],
        objects: {
          ...mappings[selectedTemplate].objects,
          [objectType]: value,
        },
      };
      updateMapping(mapping);
    }
  }, [updateMapping, mappings, selectedTemplate]);
  const updateFieldMappingCallback = useCallback((fieldType, value) => {
    if (mappings[selectedTemplate]) {
      const mapping = {
        ...mappings[selectedTemplate],
        fields: {
          ...mappings[selectedTemplate].fields,
          [fieldType]: value,
        },
      };
      updateMapping(mapping);
    }
  }, [updateMapping, mappings, selectedTemplate]);

  // Callback to delete reservations
  const onDeleteReservationsCallback = useCallback(() => {
    deleteReservations(formId);
  }, [formId, deleteReservations]);

  return (
    <div className="form-reservation-template-mapping--wrapper">
      <div className="form-reservation-template-mapping--header">
        {`Configure mapping for reservation template ${selectedTemplate}`}
      </div>
      {hasReservations && (
        <Alert
          className="form-reservation-template-mapping--alert"
          type="warning"
          message="Editing mapping will delete reservations"
          description={(
            <React.Fragment>
              <div>
                One or many submissions have already been converted to reservations with the current mapping. To edit the mapping you must first delete the reservations.
              </div>
              <Button size="small" type="link" onClick={onDeleteReservationsCallback}>Delete reservations now</Button>
            </React.Fragment>
          )}
        />
      )}
      <div className="form-reservation-template-mapping--type-header">
        <div>Timing</div>
        <div>Mapping</div>
      </div>
      <div className="form-reservation-template-mapping--list">
        {mappings &&
          selectedTemplate &&
          mappings[selectedTemplate] && (
          <TimingMapping
            mode={mappings[selectedTemplate].timing.mode}
            startDate={mappings[selectedTemplate].timing.startDate}
            endDate={mappings[selectedTemplate].timing.endDate}
            startTime={mappings[selectedTemplate].timing.startTime}
            endTime={mappings[selectedTemplate].timing.endTime}
            length={mappings[selectedTemplate].timing.length}
            onChange={updateTimingMappingCallback}
            formSections={form.sections}
            mapping={mappings[selectedTemplate]}
            disabled={hasReservations}
          />
        )}
      </div>
      <div className="form-reservation-template-mapping--type-header">
        <div>Object</div>
        <div>Mapping</div>
      </div>
      <div className="form-reservation-template-mapping--list">
        {mappings &&
          selectedTemplate &&
          mappings[selectedTemplate] &&
            (Object.keys(mappings[selectedTemplate].objects) || []).map(objectType => (
              <ObjectMapping
                key={objectType}
                options={mappingOptions}
                objectType={objectType}
                required={_.get(mappings[selectedTemplate], `propSettings[${objectType}].mandatory`, false)}
                value={mappings[selectedTemplate].objects[objectType]}
                onSelectionChange={value => updateObjectMappingCallback(objectType, value)}
                disabled={hasReservations}
              />
            ))}
      </div>
      <div className="form-reservation-template-mapping--type-header">
        <div>Field</div>
        <div>Mapping</div>
      </div>
      <div className="form-reservation-template-mapping--list">
        {mappings &&
          selectedTemplate &&
          mappings[selectedTemplate] &&
            (Object.keys(mappings[selectedTemplate].fields) || []).map(fieldType => (
              <FieldMapping
                key={fieldType}
                options={mappingOptions}
                fieldType={fieldType}
                required={_.get(mappings[selectedTemplate], `propSettings[${fieldType}].mandatory`, false)}
                value={mappings[selectedTemplate].fields[fieldType]}
                onSelectionChange={value => updateFieldMappingCallback(fieldType, value)}
                disabled={hasReservations}
              />
            ))}
      </div>
    </div>
  );
};

FormReservationTemplateMapping.propTypes = {
  form: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  mappings: PropTypes.object,
  hasReservations: PropTypes.bool.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  createMapping: PropTypes.func.isRequired,
  updateMapping: PropTypes.func.isRequired,
  deleteReservations: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
};

FormReservationTemplateMapping.defaultProps = {
  mappings: {},
};

export default withTECoreAPI(connect(mapStateToProps, mapActionsToProps)(FormReservationTemplateMapping));
