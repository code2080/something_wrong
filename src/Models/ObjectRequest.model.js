export default class ObjectRequest {
  _id;
  organizationId;
  formInstanceId;
  createdAt;
  updatedAt;
  isActive;
  
  // Fields of the object
  objectRequest;

  // Type of the object requested to be changed
  datasource;

  // New object if applicable
  replacementObjectExtId;

  // Extid of the object to be edited if type is EDIT_OBJECT
  objectExtId;

  // State of the request. PENDING || ACCEPTED || DECLINED || REPLACED 
  status;

  // Type of request   NEW_OBJECT || EDIT_OBJECT || MISSING_OBJECT
  type;


  constructor({
    _id,
    objectRequest,
    datasource,
    organizationId,
    formInstanceId,
    replacementObjectExtId = null,
    objectExtId = null,
    status = 'pending',
    type,
    isActive,
    createdAt,
    updatedAt

  }) {
    this._id = _id;
    this.objectRequest = objectRequest;
    this.datasource = datasource;
    this.organizationId = organizationId;
    this.formInstanceId = formInstanceId;
    this.replacementObjectExtId = replacementObjectExtId;
    this.objectExtId = objectExtId;
    this.status = status;
    this.type = type;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}