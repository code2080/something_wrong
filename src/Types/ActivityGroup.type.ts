export type TActivityGroup = {
  _id: string;
  name: string;
};

export class ActivityGroup {
  static create = (obj: any): TActivityGroup => ({
    _id: obj._id,
    name: obj.name,
  });
};

export type TActivityGroupMap = {
  [key: string]: TActivityGroup,
};
