import express, { Express, Request } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import conn from './config/dbConnection';
import userRoute from './users/routes/user-route';
import eventRoute from './events/routes/event-route';
import { socketHandler } from './middlewares/socket-handler';

dotenv.config();

const app: Express = express();
const port = 5000;

const server = createServer(app);

const corsOptions = {
  origin: ['http://localhost:5173'],
};

const io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
  },
});

app.use((req, res, next) => {
  (req as Request & { io: Server }).io = io;
  next();
});

// Middleware
app.use(
  cors({
    origin: corsOptions.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '5000mb', extended: true }));

// Routes
app.use('/api/auth', userRoute);
app.use('/api/event', eventRoute);

// Static files
app.use('/uploads', express.static('uploads'));

// Database connection and server startup
conn()
  .then(() => {
    socketHandler(io);
    server.listen(port, () => {
      console.log(`Express is listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to DB:', err);
  });

export { io };
