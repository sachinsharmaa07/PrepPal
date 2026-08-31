"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.setupSocket = void 0;
let ioInstance = null;
const setupSocket = (io) => {
    ioInstance = io;
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        // Join a room specific to a submission
        socket.on('join_submission', (submissionId) => {
            socket.join(`submission:${submissionId}`);
            console.log(`Socket ${socket.id} joined room submission:${submissionId}`);
        });
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
exports.setupSocket = setupSocket;
const getIO = () => {
    if (!ioInstance) {
        throw new Error('Socket.io not initialized');
    }
    return ioInstance;
};
exports.getIO = getIO;
