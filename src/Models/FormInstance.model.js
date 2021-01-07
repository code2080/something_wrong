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

  reviewLink;

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
    reviewLink,
    values = [],
    createdAt,
    updatedAt,
    index,
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
    this.reviewLink = reviewLink;
    this.values = values;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.index = index;
  }
}
