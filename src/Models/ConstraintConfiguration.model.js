export class ConstraintConfiguration {
  _id;
  formId;
  name;
  description;
  constraints;
  parameterData;
  constructor({ _id, formId, name, description, constraints, parameterData }) {
    this._id = _id;
    this.formId = formId;
    this.name = name;
    this.description = description;
    this.constraints = constraints || [];
    this.parameterData = parameterData || [];
  }
}
