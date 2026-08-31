import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { setupRoutes } from './routes';
import { setupSocket } from './socket';

import { correlationIdMiddleware } from './middleware/correlationId';
import { globalErrorHandler } from './middleware/errorHandler';

import { createAdapter } from '@socket.io/redis-adapter';
import IORedis from 'ioredis';

const app: Express = express();
const port = process.env.PORT || 8080;

const httpServer = createServer(app);

// Redis Adapter setup
const pubClient = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const subClient = pubClient.duplicate();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  },
  pingTimeout: 60000,
  adapter: createAdapter(pubClient, subClient)
});

setupSocket(io);

// Middleware
app.use(correlationIdMiddleware);

app.use(
  helmet({
    hidePoweredBy: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
      },
    },
  })
);

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(compression());

// Basic Rate Limiting: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use('/api', apiLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
setupRoutes(app);

// Global Error Handler
app.use(globalErrorHandler);

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});import './workers/execution.worker';
