export type TActivityTag = {
  _id: string;
  name: string;
  formId: string;
};

export const createFn = (obj: any): TActivityTag => ({
  _id: obj._id,
  name: obj.name,
  formId: obj.formId,
});