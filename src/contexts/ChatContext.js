import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [activeChatId, setActiveChatId] = useState(null); // ID of user we are talking to
    const [onlineUsers, setOnlineUsers] = useState([]);

    // Connect to socket
    useEffect(() => {
        const token = authService.getToken();
        if (!token) return;

        // Determine URL (relative or absolute based on env)
        const URL = window.location.hostname === 'localhost'
            ? 'http://localhost:5000'
            : window.location.origin.replace(':3000', ':5000'); // Simple heuristic or just use / for same origin in prod

        const newSocket = io(URL, {
            auth: { token },
            transports: ['websocket', 'polling']
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket Connected:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket Disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket Connection Error:', err);
            // toast.error(`Chat connection error: ${err.message}`);
        });

        newSocket.on('receive_message', (msg) => {
            setMessages((prev) => [...prev, msg]);
            if (msg.sender_id !== activeChatId) {
                toast.info(`New message from User ${msg.sender_id}`);
            }
        });

        newSocket.on('message_sent', (msg) => {
            // Confirmation of own message
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const sendMessage = (recipientId, content) => {
        if (!socket || !isConnected) {
            toast.error("Chat not connected");
            return;
        }
        socket.emit('send_message', { recipientId, content });
    };

    return (
        <ChatContext.Provider value={{
            socket,
            isConnected,
            messages,
            setMessages,
            sendMessage,
            activeChatId,
            setActiveChatId
        }}>
            {children}
        </ChatContext.Provider>
    );
};
