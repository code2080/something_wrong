export default class ObjectTypeMapping {
  applicationObjectTypeName;

  applicationObjectTypeLabel;

  objectTypeExtId;

  fields;

  constructor ({
    applicationObjectTypeName,
    applicationObjectTypeLabel,
    objectTypeExtId,
    fields,
  }) {
    this.applicationObjectTypeName = applicationObjectTypeName;
    this.applicationObjectTypeLabel = applicationObjectTypeLabel;
    this.objectTypeExtId = objectTypeExtId;
    this.fields = fields;
  }
}
