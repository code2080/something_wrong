import moment from 'moment';
import _ from 'lodash';

export default class Form {
  // FORM IDENTIFICATION
  _id;

  organizationId;

  createdAt;

  updatedAt;

  // FORM DESCRIPTIVES
  name;

  description;

  ownerId;

  assigners;

  // SETTINGS
  dueDate;

  allowLateResponses;

  sendAutomaticReminders;

  formPeriod;

  objectScope;

  reservationMode;

  excludedObjects;

  submitterCanSubmitMultiple;

  submitterMustSelectObject;

  formType;

  // STATUS
  status;

  responseCount;

  responses;

  // DESIGN
  sections;

  constructor({
    // FORM IDENTIFICATION
    _id,
    organizationId,
    createdAt,
    updatedAt,
    // FORM DESCRIPTIVES
    name,
    description,
    ownerId,
    assigners = [],
    owner, // @deprecated
    ownerName, // @deprecated
    // SETTINGS
    dueDate = moment.utc().add(1, 'day'),
    allowLateResponses = true,
    sendAutomaticReminders = true,
    formPeriod,
    objectScope,
    reservationMode,
    excludedObjects = [],
    submitterCanSubmitMultiple = true,
    submitterMustSelectObject = true,
    formType = 'REGULAR',
    allowLinkSharing = false,
    // STATUS
    status,
    responses,
    responseCount,
    // DESIGN
    sections = [],
  }) {
    // FORM IDENTIFICATION
    this._id = _id;
    this.organizationId = organizationId;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    // FORM DESCRIPTIVES
    this.name = name;
    this.description = description;
    this.ownerId = ownerId;
    this.ownerName =
      ownerName || (owner && `${owner.firstName} ${owner.lastName}`);
    this.assigners = assigners;

    // SETTINGS
    this.dueDate = dueDate || moment().add(1, 'day');
    this.dueDateDisplay = dueDate ? moment(dueDate).format("MMM DD 'YY") : null;
    this.allowLateResponses = allowLateResponses;
    this.sendAutomaticReminders = sendAutomaticReminders;
    this.formPeriod = formPeriod || {
      startDate: moment().add(1, 'day'),
      endDate: moment().add(8, 'day'),
    };
    this.formPeriodDisplay =
      formPeriod && formPeriod.startDate && formPeriod.endDate
        ? `${moment(formPeriod.startDate).format("MMM DD 'YY")} - 
          ${moment(formPeriod.endDate).format("MMM DD 'YY")}`
        : null;
    this.objectScope = objectScope;
    this.reservationMode = reservationMode;
    this.excludedObjects = excludedObjects;
    this.submitterCanSubmitMultiple = submitterCanSubmitMultiple;
    this.submitterMustSelectObject = submitterMustSelectObject;
    this.formType = formType;
    this.allowLinkSharing = allowLinkSharing;

    // STATUS
    this.status = status;
    this.responseCount = responseCount || 0;
    this.responses = responses;

    // DESIGN
    this.sections = sections || [];
  }

  static getOwnerName(ownerId) {
    try {
      const storeState = window.tePrefsLibStore.getState();
      const ownerName = _.get(storeState, `users.${ownerId}.name`, null);
      return ownerName;
    } catch (err) {
      return null;
    }
  }
}
