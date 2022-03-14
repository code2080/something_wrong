export type TSchedulingError = {
  message?: string;
  details?: string;
  code?: any;
};

export const createFn = (obj: any = {}): TSchedulingError => ({
  message: obj ? obj.message : undefined,
  details: obj ? obj.details : undefined,
  code: obj ? obj.code : undefined,
});
