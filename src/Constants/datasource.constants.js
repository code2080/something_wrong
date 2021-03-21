export const datasourceValueTypes = {
  OBJECT_EXTID: 'OBJECT_EXTID',
  TYPE_EXTID: 'TYPE_EXTID',
  FIELD_EXTID: 'FIELD_EXTID',
  FIELD_VALUE: 'FIELD_VALUE',
};

export const mapValueTypeToFieldName = (valueType) =>
  ({
    [datasourceValueTypes.OBJECT_EXTID]: 'objects',
    [datasourceValueTypes.FIELD_EXTID]: 'fields',
    [datasourceValueTypes.TYPE_EXTID]: 'types',
  }[valueType]);
