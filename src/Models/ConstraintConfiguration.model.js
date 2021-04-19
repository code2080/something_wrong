export class ConstraintConfiguration {
  _id;
  formId;
  name;
  description;
  constraints;
  constructor({ _id, formId, name, description, constraints }) {
    this._id = _id;
    this.formId = formId;
    this.name = name;
    this.description = description;
    this.constraints = constraints || [];
  }
}
