import { EConstraintOperators, EConstraintType } from './Constraint.type';

export type TConstraintInstance = {
  constraintId: string;
  isActive: boolean;
  isHardConstraint: boolean;
  weight?: number;
  parameters: {};
  operator: EConstraintOperators;
};

export class ConstraintInstance {
  static createFromConstraint = (obj: any): TConstraintInstance => ({
    constraintId: obj.constraintId,
    isActive: obj.type === EConstraintType.DEFAULT,
    isHardConstraint: obj.isHardConstraint,
    weight: obj.weight,
    parameters: obj.parameters,
    operator: EConstraintOperators['<'],
  });
}

export type TConstraintConfiguration = {
  _id?: string;
  formId: string;
  name: string;
  description?: string;
  constraints: TConstraintInstance[];
};

export class ConstraintConfiguration {
  static create = (obj: any): TConstraintConfiguration => ({
    _id: obj._id || null,
    formId: obj.formId,
    name: obj.name,
    description: obj.description || null,
    constraints: obj.constraints || {},
  });
}
