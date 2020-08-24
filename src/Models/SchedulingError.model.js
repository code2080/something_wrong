export class SchedulingError {
  message; // Human readable message

  code; // Machine readable code

  constructor({
    message,
    code,
  }) {
    this.message = message;
    this.code = code;
  }
}
