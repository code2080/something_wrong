export type TProp = {
  label: string;
  value: string;
};

export type TProperty = TProp & {
  children?: TProp[];
};
