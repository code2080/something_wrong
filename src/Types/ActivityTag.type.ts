export type TActivityTag = {
  _id: string;
  name: string;
  formId: string;
};

export class ActivityTag {
  static create = (obj: any): TActivityTag => ({
    _id: obj._id,
    name: obj.name,
    formId: obj.formId,
  });
}

export type TActivityTagMap = {
  [key: string]: TActivityTag;
};
