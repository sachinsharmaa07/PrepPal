import { Server, Socket } from 'socket.io';

let ioInstance: Server | null = null;

export const setupSocket = (io: Server) => {
  ioInstance = io;
  
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // Join a room specific to a submission
    socket.on('join_submission', (submissionId: string) => {
      socket.join(`submission:${submissionId}`);
      console.log(`Socket ${socket.id} joined room submission:${submissionId}`);
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
