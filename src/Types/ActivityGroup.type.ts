export type TActivityGroup = {
  _id: string;
  name: string;
  formId: string;
};

export class ActivityGroup {
  static create = (obj: any): TActivityGroup => ({
    _id: obj._id,
    name: obj.name,
    formId: obj.formId,
  });
};

export type TActivityGroupMap = {
  [key: string]: TActivityGroup,
};
