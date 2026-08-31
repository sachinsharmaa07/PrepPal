import { Server, Socket } from 'socket.io';

import jwt from 'jsonwebtoken';

let ioInstance: Server | null = null;

export const setupSocket = (io: Server) => {
  ioInstance = io;
  
  // JWT Auth Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}, User: ${(socket as any).user?.id}`);
    
    // Join a room specific to a user
    socket.join(`user:${(socket as any).user?.id}`);
    
    // Join a room specific to a submission
    socket.on('join_submission', (submissionId: string) => {
      // Validate submissionId format
      if (typeof submissionId === 'string' && submissionId.length > 0) {
        socket.join(`submission:${submissionId}`);
        console.log(`Socket ${socket.id} joined room submission:${submissionId}`);
      }
    });
    
    // Join a room specific to an interview session
    socket.on('join_interview', (interviewId: string) => {
      if (typeof interviewId === 'string' && interviewId.length > 0) {
        socket.join(`interview:${interviewId}`);
        console.log(`Socket ${socket.id} joined room interview:${interviewId}`);
      }
    });
    
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized');
  }
  return ioInstance;
};
