export class ActivityValueValidation {
  status;

  errorCode;

  errorMessage;

  constructor({ status, errorCode, errorMessage }) {
    this.status = status;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }
}
