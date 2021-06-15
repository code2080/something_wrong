export type TProp = {
  label: string;
  value: string | string[];
};

export type TProperty = TProp & {
  children?: TProp[];
};
