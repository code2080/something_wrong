export class ConstraintConfiguration {
  formId;
  name;
  description;
  constraints;
  timestamps;
  constructor ({ formId, name, description, constraints, timestamps }) {
    this.formId = formId;
    this.name = name;
    this.description = description;
    this.constraints = constraints || [];
    this.timestamps = timestamps;
  }
}
