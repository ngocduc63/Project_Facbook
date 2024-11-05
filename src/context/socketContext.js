import { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { LINK_API } from '../api/const';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socketio, setSocket] = useState(null);
    const [usersOnline, setUsersOnline] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') ?? {});
        if (!user?.id) return;
        const socket = io.connect(LINK_API, {
            query: { user_id: user.id },
        });
        setSocket(socket);

        // Gửi sự kiện tùy chỉnh tới server trước khi đóng kết nối
        const handleBeforeUnload = () => {
            socket.emit('user_disconnecting', { user_id: user.id });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            socket.emit('user_disconnecting', { user_id: user.id });
            socket.close();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (!socketio) return;
        socketio.on('user_online', (data) => {
            setUsersOnline(data);
            console.log(data);
        });

        return () => {
            socketio.off('user_online');
        };
    }, [socketio]);

    return <SocketContext.Provider value={{ socketio, usersOnline }}>{children}</SocketContext.Provider>;
};
