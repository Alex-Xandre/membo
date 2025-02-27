import { Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';

declare module 'express-serve-static-core' {
  interface Request {
    io: Server;
  }
}