export class ConstraintConfiguration {
  constraintConfigurationId;
  formId;
  name;
  description;
  constraints;
  timestamps;
  userId;
  constructor({
    formId,
    name,
    description,
    constraints,
    timestamps,
    constraintConfigurationId,
  }) {
    this.formId = formId;
    this.name = name;
    this.description = description;
    this.constraints = constraints || [];
    this.timestamps = timestamps;
    this.constraintConfigurationId = constraintConfigurationId;
  }
}
