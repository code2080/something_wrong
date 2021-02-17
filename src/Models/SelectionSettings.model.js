export class SelectionSettings {
  includedFields;
  extraObjects;

  constructor ({
    includedFields,
    extraObjects,
  }) {
    this.includedFields = includedFields || [];
    this.extraObjects = extraObjects || [];
  }
}

export const IncludedFieldInterface = {
  fieldExtId: undefined,
  element: undefined,
};
