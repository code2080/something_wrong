import { DefaultEventsMap } from '@socket.io/component-emitter';
import socketIOClient, { Socket } from 'socket.io-client';
import { getEnvParams } from '../configs';

class EventListener {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  constructor() {
    const url = `${getEnvParams().AM_BE_URL}`;
    const socketUrl = url.slice(0, url.length - 3);

    this.socket = socketIOClient(socketUrl, {
      transports: ['websocket'],
    });

    this.socket.on('connect_error', (args) => console.log(args));

    // initiate disconnect handler
    this.socket.on('disconnect', (reason) =>
      console.info(`WS connection closed, reason: ${reason}`),
    );
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public watchJob({ formId }, callback) {
    this.socket.emit('watchJobs', { formId }, (response) => {
      console.info(
        `Established watchJobs event for formId: ${response.formId}`,
      );
    });

    this.socket.on('jobUpdate', ({ job }) => {
      console.info(`Received job update: ${job?._id ?? null}`);
      callback(job);
    });
  }

  public activityGeneration({ formId }, callback) {
    this.socket.emit('activityGeneration', { formId }, (response) => {
      console.info(
        `Established activityGeneration event for formId: ${response.formId}`,
      );
    });

    this.socket.on('activityGeneration', ({ status, formId }) => {
      console.info(`Activities are created for formId: ${formId}`);
      callback({ status, formId });
    });
  }
}

export default EventListener;
