export class SchedulingReturn {
  status;

  reservationId;

  errorCode;

  errorMessage;

  constructor({ status, reservationId, errorCode, errorMessage }) {
    this.status = status;
    this.reservationId = reservationId;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }
}
