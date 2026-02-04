const pool = require('../config/database');
const jwt = require('jsonwebtoken');

module.exports = (io) => {
    // Middleware to verify token for socket connection
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    const userSockets = new Map(); // Map user_id -> socket_id

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.email} (${socket.id})`);

        // Map user ID to socket ID
        userSockets.set(socket.user.userId, socket.id);

        // Join a room with their own user ID for direct messaging
        socket.join(`user_${socket.user.userId}`);

        // Handle sending messages
        socket.on('send_message', async (data) => {
            const { recipientId, content } = data;
            const senderId = socket.user.userId;

            try {
                // Save to database
                const result = await pool.query(
                    'INSERT INTO messages (sender_id, recipient_id, content) VALUES ($1, $2, $3) RETURNING *',
                    [senderId, recipientId, content]
                );

                const newMessage = result.rows[0];

                // Emit to recipient if online
                io.to(`user_${recipientId}`).emit('receive_message', newMessage);

                // Emit back to sender (for confirmation)
                socket.emit('message_sent', newMessage);

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user.email);
            userSockets.delete(socket.user.userId);
        });
    });
};
