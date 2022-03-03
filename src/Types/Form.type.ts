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

export type TJointTeachingFormConfigProps = {
  isEnabled: boolean;
  useActivityTemplatesType: boolean;
  timing: string;
  duration: string;
  activityType: string;
  general: string;
};
