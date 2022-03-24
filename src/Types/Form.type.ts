export type TForm = {
  _id: string;
  name: string;
  description: string;
  status: string;
  previousStatus: string;
  ownerId: string;
  sections: Array<any>;
  organizationId: string;
  dueDate: Date;
  allowLateResponses: boolean;
  sendAutomaticReminders: boolean;
  formPeriod: {
    startDate: Date;
    endDate: Date;
  };
  reservationMode: string;
  objectScope: string;
  scopedObjectFilters: { [k: string]: any };
  excludedObjects: Array<any>;
  submitterMustSelectObject: boolean;
  submitterCanSubmitMultiple: boolean;
  allowLinkSharing: boolean;
  formType: string;
  rollOverFormConfig: { [k: string]: any };
  holidayConfigs: { [k: string]: any };
  allowToCreateNewPrimaryObject: boolean;
};

export const createFn = (obj: any): TForm => ({
  _id: obj._id,
  name: obj.name,
  description: obj.description,
  status: obj.status,
  previousStatus: obj.previousStatus,
  ownerId: obj.ownerId,
  sections: obj.sections || [],
  organizationId: obj.organizationId,
  dueDate: obj.dueDate,
  allowLateResponses: obj.allowLateResponses || false,
  sendAutomaticReminders: obj.sendAutomaticReminders || false,
  formPeriod: {
    startDate: obj.formPeriod?.startDate,
    endDate: obj.formPeriod?.endDate,
  },
  reservationMode: obj.reservationMode,
  objectScope: obj.objectScope,
  scopedObjectFilters: obj.scopedObjectFilters || {},
  excludedObjects: obj.excludedObjects || [],
  submitterMustSelectObject: obj.submitterMustSelectObject || false,
  submitterCanSubmitMultiple: obj.submitterCanSubmitMultiple || false,
  allowLinkSharing: obj.allowLinkSharing || false,
  formType: obj.formType,
  rollOverFormConfig: obj.rollOverFormConfig || {},
  holidayConfigs: obj.holidayConfigs || {},
  allowToCreateNewPrimaryObject: obj.allowToCreateNewPrimaryObject || false,
});

export type TJointTeachingFormConfigProps = {
  isEnabled: boolean;
  useActivityTemplatesType: boolean;
  timing: string;
  duration: string;
  activityType: string;
  general: string;
};
