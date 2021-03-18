export enum EPropertyType {
  VALUE = 'VALUE',
  HEADING = 'HEADING',
}

export type TProperty = {
  label: string;
  value: string;
  type?: EPropertyType | null;
};
