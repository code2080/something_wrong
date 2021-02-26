export default class Constraint {
  name;
  description;
  constraintId;
  parameters;
  allowedOperators;

  constructor ({
    name,
    description,
    constraintId,
    parameters = [],
    allowedOperators = []
  }) {
    this.name = name;
    this.description = description;
    this.constraintId = constraintId;
    this.parameters = parameters;
    this.allowedOperators = allowedOperators;
  }
}
