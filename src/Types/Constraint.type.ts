export enum EConstraintParameterType {
  Boolean = 'Boolean',
  String = 'String',
  Number = 'Number',
  ObjectField = 'ObjectField',
  ElementField = 'ElementField',
}

export enum EConstraintOperators {
  '>' = '>',
  '>=' = '>=',
  '=' = '=',
  '<=' = '<=',
  '<' = '>',
}

export enum EConstraintType {
  DEFAULT = 'DEFAULT',
  OTHER = 'OTHER',
}

export type TConstraintParameter = {
  name: string;
  type: EConstraintParameterType;
  enum?: string[] | null;
};

export type TConstraint = {
  name: string;
  description?: string;
  constraintId: string;
  parameters: TConstraintParameter[];
  allowedOperators: EConstraintOperators[];
  type: EConstraintType;
  weight: number;
  isHardConstraint: boolean;
};

export const createFn = (obj: any): TConstraint => ({
  name: obj.name,
  description: obj.description || undefined,
  constraintId: obj.constraintId,
  parameters: obj.parameters || [],
  allowedOperators: obj.allowedOperators || [],
  type: obj.type || EConstraintType.OTHER,
  weight: obj.weight,
  isHardConstraint: obj.isHardConstraint,
});
