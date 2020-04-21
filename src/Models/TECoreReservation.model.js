export class TECoreReservationModel {
  startTime;
  endTime;
  objects;
  fields;

  constructor({ startTime, endTime, objects, fields }) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.objects = objects;
    this.fields = fields;
  }
}

export class TECoreFieldModel {
  fieldExtId;
  value;

  constructor(activityValue) {
    this.fieldExtId = activityValue.extId;
    this.value = activityValue.value;
  }
}

export class TECoreObjectModel {
  typeExtId;
  objectExtIds;

  constructor(activityValue) {
    this.typeExtId = activityValue.extId;
    this.objectExtIds = activityValue.value;
  }
}
