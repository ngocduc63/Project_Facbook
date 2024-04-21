import { createContext, useState } from 'react';

export const MessageContext = createContext();

export const MessageContextProvider = ({ children }) => {
    const [currentRoom, setCurrentRoom] = useState('');

    return <MessageContext.Provider value={{ currentRoom, setCurrentRoom }}>{children}</MessageContext.Provider>;
};
