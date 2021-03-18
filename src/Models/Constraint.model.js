export default class Constraint {
  name;
  description;
  constraintId;
  parameters;
  allowedOperators;
  timeStamp;
  constructor({
    name,
    description,
    constraintId,
    parameters = [],
    allowedOperators = [],
    timeStamp,
  }) {
    this.name = name;
    this.description = description;
    this.constraintId = constraintId;
    this.parameters = parameters || [];
    this.allowedOperators = allowedOperators || [];
    this.timeStamp = timeStamp;
  }
}
