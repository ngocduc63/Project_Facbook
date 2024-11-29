import { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { LINK_API } from '../api/const';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socketio, setSocket] = useState(null);
    const [usersOnline, setUsersOnline] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user?.id) return;

        const socket = io.connect(LINK_API, {
            query: { user_id: user.id },
        });
        setSocket(socket);

        const handleBeforeUnload = () => {
            if (socket.connected) {
                socket.emit('user_disconnecting', { user_id: user.id });
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            if (socket.connected) {
                socket.emit('user_disconnecting', { user_id: user.id });
            }
            socket.close();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (!socketio) return;
        socketio.on('user_online', (data) => {
            setUsersOnline(data);
        });

        return () => {
            socketio.off('user_online');
        };
    }, [socketio]);

    return <SocketContext.Provider value={{ socketio, usersOnline }}>{children}</SocketContext.Provider>;
};
