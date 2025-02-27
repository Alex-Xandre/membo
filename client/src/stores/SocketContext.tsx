import { createContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { API_ENDPOINT } from '../config/API';

interface SocketContextValue {
  socket: Socket;
}

const socket: Socket = io(API_ENDPOINT);

export const SocketContext = createContext<SocketContextValue>({ socket });
