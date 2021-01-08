import React, { useMemo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, Icon } from 'antd';

// COMPONENTS
import ExtraObjectRow from './ExtraObjectRow';
import IncludedFieldRow from './IncludedFieldRow';

// ACTIONS
import { updateSelectionSettings } from '../../Redux/FormSubmissions/formSubmissions.actions';
import { findFieldsOnReservationMode } from '../../Redux/Integration/integration.actions';

// HELPERS
import withTECoreAPI from '../../Components/TECoreAPI/withTECoreAPI';
import { getExtraObjectElementsInForm } from '../../Utils/forms.helpers';
import { getSelectionSettings, getSelectionFieldElements } from '../../Utils/sections.helpers';

// STYLES
import './SelectionSettings.scss';

// CONSTANTS
import { IncludedFieldInterface } from '../../Models/SelectionSettings.model';

const mergeAddField = selectionSettings => ({
  ...selectionSettings,
  includedFields: [
    ...(selectionSettings.includedFields || []),
    { ...IncludedFieldInterface },
  ],
});

const mergeDeleteField = (selectionSettings, rowIdx) => ({
  ...selectionSettings,
  includedFields: [
    ...selectionSettings.includedFields.slice(0, rowIdx),
    ...selectionSettings.includedFields.slice(rowIdx + 1),
  ],
});

const mergeChangeField = (selectionSettings, rowIdx, val) => ({
  ...selectionSettings,
  includedFields: [
    ...selectionSettings.includedFields.slice(0, rowIdx),
    val,
    ...selectionSettings.includedFields.slice(rowIdx + 1),
  ],
});

const mergeAddObject = selectionSettings => ({
  ...selectionSettings,
  extraObjects: [
    ...selectionSettings.extraObjects,
    [],
  ]
});

const mergeDeleteObject = (selectionSettings, rowIdx) => ({
  ...selectionSettings,
  extraObjects: [
    ...selectionSettings.extraObjects.slice(0, rowIdx),
    ...selectionSettings.extraObjects.slice(rowIdx + 1),
  ],
});

const mergeChangeObject = (selectionSettings, rowIdx, val) => ({
  ...selectionSettings,
  extraObjects: [
    ...selectionSettings.extraObjects.slice(0, rowIdx),
    val,
    ...selectionSettings.extraObjects.slice(rowIdx + 1),
  ],
});

const mapStateToProps = (state, { section, formInstanceId, formId }) => {
  const formInstance = state.submissions[formId][formInstanceId];
  const { reservationMode } = state.forms[formId];
  return {
    reservationMode,
    reservationModeFields: reservationMode ? _.get(state, `integration.reservationModes.${reservationMode}.fields`, []) : [],
    formSections: state.forms[formId] ? state.forms[formId].sections : [],
    sectionId: section._id,
    selectionSettings: getSelectionSettings(section._id, formInstance),
  };
};

const mapActionsToProps = {
  updateSelectionSettings,
  findFieldsOnReservationMode,
};

const SelectionSettings = ({
  section,
  formId,
  formInstanceId,
  selectionSettings,
  sectionId,
  formSections,
  reservationMode,
  reservationModeFields,
  updateSelectionSettings,
  findFieldsOnReservationMode,
  teCoreAPI,
}) => {
  const [typeTree, setAvailableFields] = useState([]);
  // Effect to set activity fields
  useEffect(() => {
    if (reservationMode) {
      findFieldsOnReservationMode(reservationMode);
    }
    async function exec() {
      const typeTree = await teCoreAPI.getReservationFields();
      setAvailableFields(typeTree.map(el => ({ label: el.name, value: el.extid })));
    }
    exec();
  }, []);

  const fieldOptions = useMemo(() => {
    if (reservationModeFields.length > 0)
      return reservationModeFields.map(
        value => ({
          value,
          label: (typeTree.find(el => el.value === value) || { label: value }).label,
        })
      );
    return typeTree;
  }, [reservationModeFields, typeTree]);

  const availableObjectElements = useMemo(() => getExtraObjectElementsInForm(formSections), [formSections]);
  const availableFieldElements = useMemo(() => getSelectionFieldElements(section), [section]);

  const onAddField = useCallback(
    () =>
      updateSelectionSettings({ formId, formInstanceId, sectionId, selectionSettings: mergeAddField(selectionSettings) }),
    [formId, formInstanceId, sectionId, selectionSettings]);

  const onDeleteField = useCallback(
    rowIdx =>
      updateSelectionSettings({ formId, formInstanceId, sectionId, selectionSettings: mergeDeleteField(selectionSettings, rowIdx) }),
    [formId, formInstanceId, sectionId, selectionSettings]);

  const onChangeField = useCallback(
    (rowIdx, val) =>
      updateSelectionSettings({ formId, formInstanceId, sectionId, selectionSettings: mergeChangeField(selectionSettings, rowIdx, val) }),
    [formId, formInstanceId, sectionId, selectionSettings]);

  const onChangeExtraObject = useCallback(
    (rowIdx, val) =>
      updateSelectionSettings({ formId, formInstanceId, sectionId, selectionSettings: mergeChangeObject(selectionSettings, rowIdx, val) }),
    [formId, formInstanceId, sectionId, selectionSettings]);

  const onDeleteExtraObject = useCallback(
    rowIdx =>
      updateSelectionSettings({ formId, formInstanceId, sectionId, selectionSettings: mergeDeleteObject(selectionSettings, rowIdx) }),
    [formId, formInstanceId, sectionId, selectionSettings]);

  const onAddExtraObject = useCallback(
    () =>
      updateSelectionSettings({ formId, formInstanceId, sectionId, selectionSettings: mergeAddObject(selectionSettings) }),
    [formId, formInstanceId, sectionId, selectionSettings]);

  return (
    <div className="selection-settings--wrapper">
      <div className="selection-settings--setting">
        <div className="selection-settings__setting--title">Included fields</div>
        <div className="selection-settings__columns">
          <div className="selection-settings__column">Field</div>
          <div className="selection-settings__column">Element</div>
        </div>
        {(selectionSettings.includedFields || []).map((el, rowIdx) => (
          <IncludedFieldRow
            key={rowIdx}
            fieldOptions={fieldOptions}
            elementOptions={availableFieldElements}
            value={el}
            rowIdx={rowIdx}
            onChange={onChangeField}
            onDelete={onDeleteField}
          />
        ))}
        <Button size="small" type="primary" onClick={onAddField}>
          <Icon type="plus" />
          Add field
        </Button>
      </div>
      <div className="selection-settings--setting">
        <div className="selection-settings__setting--title">Extra objects</div>
        <div className="selection-settings__columns">
          <div className="selection-settings__column">Element</div>
          <div className="selection-settings__column">Value</div>
        </div>
        {(selectionSettings.extraObjects || []).map((el, rowIdx) => (
          <ExtraObjectRow
            formId={formId}
            formInstanceId={formInstanceId}
            rowIdx={rowIdx}
            availableObjects={availableObjectElements}
            value={el}
            key={rowIdx}
            onChange={onChangeExtraObject}
            onDelete={onDeleteExtraObject}
          />
        ))}
      </div>
      <Button size="small" type="primary" onClick={onAddExtraObject}>
        <Icon type="plus" />
        Add object
      </Button>
    </div>
  );
};

SelectionSettings.propTypes = {
  section: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  formInstanceId: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  selectionSettings: PropTypes.object.isRequired,
  formSections: PropTypes.array.isRequired,
  reservationMode: PropTypes.string,
  validFields: PropTypes.array.isRequired,
  updateSelectionSettings: PropTypes.func.isRequired,
  findFieldsOnReservationMode: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
};

export default withTECoreAPI(connect(mapStateToProps, mapActionsToProps)(SelectionSettings));
