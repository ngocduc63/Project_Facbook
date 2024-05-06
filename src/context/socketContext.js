import { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socketio, setSocket] = useState(null);

    useEffect(() => {
        if (socketio) return;
        const socket = io.connect('http://localhost:5000', {
            // query: { refresh_token },
        });
        setSocket(socket);
    }, [socketio]);

    return <SocketContext.Provider value={{ socketio }}>{children}</SocketContext.Provider>;
};
