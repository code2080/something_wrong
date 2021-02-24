export class ConstraintConfiguration {
  constraintId;
  isActive;
  isHardConstraint;
  weight;
  parameters;
  operator;

  constructor ({
    constraintId,
    isActive,
    isHardConstraint,
    weight,
    parameters = [],
    operator
  }) {
    this.constraintId = constraintId;
    this.isActive = isActive;
    this.isHardConstraint = isHardConstraint;
    this.weight = weight;
    this.parameters = parameters;
    this.operator = operator;
  }
}
