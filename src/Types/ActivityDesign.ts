export type TActivityDesign = {
  _id: string;
  timing: {
    [key: string]: string[] | string;
  };
  name: string;
  formId: string;
  organizationId: string;
  fields: { [key: string]: string[] };
  objects: { [key: string]: string[] };
  propSettings: { [key: string]: any };
};