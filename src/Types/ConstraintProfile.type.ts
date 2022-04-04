import { EConstraintOperators } from './Constraint.type';

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
  isActive: obj.isActive || true,
  isHardConstraint: obj.isHardConstraint || false,
  weight: obj.weight || 1,
  parameters: obj.parameters,
  operator: obj.operator || EConstraintOperators['<'],
});



export const createFn = (obj:any): TConstraintProfile => ({
    _id: obj._id || null,
    formId: obj.formId,
    name: obj.name,
    description: obj.description || null,
    constraints: obj.constraints || {},
  });

