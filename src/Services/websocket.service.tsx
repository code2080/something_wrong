import React, { useContext, useEffect } from 'react';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { getEnvParams } from "configs";
import socketIOClient, { Socket } from "socket.io-client";
import { ESocketEvents, IDefaultSocketPayload } from 'Types/WebSocket.type';

export const initializeSocketConnection = () => {
  // Get the URL
  const url = `${getEnvParams().AM_BE_URL}`;
  const socketUrl = url.slice(0, url.length - 3);

  // Initialize connection
  const socket: Socket<DefaultEventsMap, DefaultEventsMap> = socketIOClient(socketUrl, { transports: ['websocket'], forceNew: false });
  // Set up default event handlers
  socket.on('connect', () => {
    console.log(`Websocket connection established to Activity Manager BE`);
  });

  socket.on('connect_error', (error) => {
    console.error(`Websocket connection failed to connect: `, error.toString())
  });

  socket.on('disconnect', (reason) => console.info(`WS connection closed with reason: ${reason}`));

  return socket;
};

const SocketContext = React.createContext<{ socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined }>({ socket: undefined });

export const WebsocketProvider: React.FC = ({ children }) => {
  const socket = initializeSocketConnection();

  useEffect(() => {
    return () => {
      socket?.disconnect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

const defaultSubscriptionNotifier = (eventType: ESocketEvents, formId: string) => 
  console.info(`Established subscription to ${eventType} for formId: ${formId}`);


type Props = {
  formId: string;
  eventMap: Record<string, (...args: any[]) => void>
};

export const useSubscribeToFormEvents = ({ formId, eventMap }: Props) => {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      Object.keys(eventMap).forEach((socketEvent) => {
        if (socketEvent && typeof eventMap[socketEvent] === 'function' && Object.values(ESocketEvents).includes(socketEvent as ESocketEvents)) {
          // Subscribe
          socket.emit(socketEvent, { formId }, (resp: any) => defaultSubscriptionNotifier(ESocketEvents.ACTIVITIES_UPDATE, resp.formId));
          // Set up handler
          socket.off(socketEvent).on(socketEvent, (payload: IDefaultSocketPayload) => {
            console.info(`Received ${socketEvent} event, executing associated handler`);
            eventMap[socketEvent](payload);
          });
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, eventMap, formId]);
};
  