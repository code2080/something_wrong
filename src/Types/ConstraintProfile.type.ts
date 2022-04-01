import { EConstraintOperators, EConstraintType } from './Constraint.type';

export type TConstraintInstance = {
  constraintId: string;
  isActive: boolean;
  isHardConstraint: boolean;
  weight?: number;
  parameters: any[];
  operator: EConstraintOperators;
};

export type TConstraintProfile = {
  _id: string;
  formId: string;
  name: string;
  description?: string;
  constraints: TConstraintInstance[];
};

export const createConstraintInstanceFn = (obj: any): TConstraintInstance => ({
  constraintId: obj.constraintId,
  isActive: obj.type === EConstraintType.DEFAULT,
  isHardConstraint: obj.isHardConstraint,
  weight: obj.weight,
  parameters: obj.parameters,
  operator: EConstraintOperators['<'],
});



export const createFn = (obj:any): TConstraintProfile => ({
    _id: obj._id || null,
    formId: obj.formId,
    name: obj.name,
    description: obj.description || null,
    constraints: obj.constraints || {},
  });

