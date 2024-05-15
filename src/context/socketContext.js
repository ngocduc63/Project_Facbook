import { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { LINK_API } from '../api/const';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socketio, setSocket] = useState(null);

    useEffect(() => {
        if (socketio) return;
        const socket = io.connect(LINK_API, {
            // query: { refresh_token },
        });
        setSocket(socket);
    }, [socketio]);

    return <SocketContext.Provider value={{ socketio }}>{children}</SocketContext.Provider>;
};
