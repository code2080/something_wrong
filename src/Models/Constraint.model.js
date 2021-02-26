export default class Constraint {
  name;
  description;
  constraintId;
  parameters;
  allowedOperators;
  type;
  constructor ({
    name,
    description,
    constraintId,
    parameters = [],
    allowedOperators = [],
    type = {}
  }) {
    this.name = name;
    this.description = description;
    this.constraintId = constraintId;
    this.parameters = parameters || [];
    this.allowedOperators = allowedOperators || [];
    this.type = type;
  }
}
