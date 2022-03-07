export class ActivityValueRenderPayload {
  /**
   * @function create
   * @description creates a normalized render payload for an activity value
   * @param {String} status MISSING_DATA || READY_FOR_SCHEDULING
   * @param {String} value the raw value to use for scheduling
   * @param {String} renderedComponent the rendered component to be used for presentation
   * @param {String} errorMessage error message to display if status === MISSING_DATA
   * @returns {Object} renderPayload
   */
  static create = ({ status, value, renderedComponent, errorMessage }) => ({
    status,
    value,
    renderedComponent,
    errorMessage,
  });
}
