export class SchedulingError {
  message; // Human readable message

  code; // Machine readable code

  constructor({
    message,
    details,
    code,
  }) {
    this.message = message;
    this.details = details;
    this.code = code;
  }
}
