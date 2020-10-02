import FormInstanceTECoreProps from './FormInstanceTECoreProps.model';

export default class FormInstance {
  _id;

  scopedObject;

  status;

  formId;

  userId;

  recipientId;

  email;

  firstName;

  lastName;

  submitter;

  teCoreProps;

  values;

  createdAt;

  updatedAt;

  constructor({
    _id,
    scopedObject,
    status,
    formId,
    userId,
    recipientId,
    email,
    firstName,
    lastName,
    teCoreProps,
    values = [],
    createdAt,
    updatedAt,
  }) {
    this._id = _id;
    this.scopedObject = scopedObject;
    this.status = status;
    this.formId = formId;
    this.userId = userId;
    this.recipientId = recipientId;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.submitter = `${firstName} ${lastName}`;
    this.teCoreProps = new FormInstanceTECoreProps(teCoreProps || {});
    this.values = values;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
