import React, { useEffect, useRef } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';

// REDUX
import { selectOrgId } from 'Redux/Auth/auth.selectors';

// CONFIGS
import { getEnvParams } from 'configs';

// TYPES
import { DefaultEventsMap } from '@socket.io/component-emitter';
import {
  IDefaultSocketPayload,
  ISocketContext,
  TSocketEventMap,
  WEBSOCKET_UPDATE,
} from 'Types/WebSocket.type';

/**
 * Returns true if a disconnect reason should lead to a reconnect
 * @param disconnectReason
 * @returns {Bool}
 */
const shouldTryReconnect = (
  disconnectReason: Socket.DisconnectReason,
): boolean => {
  const VALID_RECONNECT_REASONS = [
    'io server disconnect',
    'transport close',
  ] as Socket.DisconnectReason[];
  return VALID_RECONNECT_REASONS.includes(disconnectReason);
};

export const initializeSocketConnection = (organizationId: string) => {
  // Get the URL
  const url = `${getEnvParams().AM_BE_URL}`;
  const socketUrl = url.slice(0, url.length - 3);

  // Initialize connection
  const socket: Socket<DefaultEventsMap, DefaultEventsMap> = socketIOClient(
    socketUrl,
    { query: { organizationId } },
  );

  // Set up default event handlers
  socket.on('connect', () => {
    console.log(`Websocket connection established to Activity Manager BE`);
  });

  socket.on('connect_error', (error) => {
    console.error(`Websocket connection failed to connect: `, error.toString());
    setTimeout(() => {
      if (!socket.connected) socket.io.connect();
    }, 1000);
  });

  socket.on('disconnect', (reason) => {
    console.info(`WS connection closed with reason: ${reason}`);

    if (shouldTryReconnect(reason)) socket.io.connect();
  });

  return socket;
};

export const SocketContext = React.createContext<ISocketContext>({
  socket: undefined,
  setEventMap: () => {},
  setFormId: () => {},
});

export const WebsocketProvider: React.FC = ({ children }) => {
  // Holds the socket ref
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  // Holds the event maps
  const eventMapRef = useRef<TSocketEventMap>();
  // Holds the current formId
  const formIdRef = useRef<string | undefined>();

  // Holds the current organizationId
  const orgId = useSelector(selectOrgId);

  /**
   * Function to parse events
   */
  const parseSocketEvent = (event: IDefaultSocketPayload) => {
    // Need to be on the same formId
    if (formIdRef?.current !== event.formId) return;

    // Execute the handler
    eventMapRef?.current?.[event.type]?.(event);
  };

  /**
   * Function to set the event map
   */
  const setEventMap = (eventMap: TSocketEventMap) => {
    eventMapRef.current = eventMap;
  };

  /**
   * Function to set the form id
   */
  const setFormId = (formId: string | undefined) => {
    formIdRef.current = formId;
  };

  /**
   * Effect to connect to BE every time we get an updated organization id
   */
  useEffect(() => {
    if (orgId) {
      // Initialize the socket connection
      socketRef.current = initializeSocketConnection(orgId);
      socketRef.current
        .off(WEBSOCKET_UPDATE)
        .on(WEBSOCKET_UPDATE, (event: IDefaultSocketPayload) =>
          parseSocketEvent(event),
        );
    }

    // Unmount
    return () => {
      socketRef?.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, setEventMap, setFormId }}
    >
      {children}
    </SocketContext.Provider>
  );
};
