import { createContext, useState } from 'react';
import { useEffect } from 'react';

export const MessageContext = createContext();

export const MessageContextProvider = ({ children }) => {
    const [currentRoom, setCurrentRoom] = useState('');
    const [isChangeRoom, setIsChangeRoom] = useState(false);

    useEffect(() => {
        if (!currentRoom) return;

        setIsChangeRoom(true);
    }, [currentRoom]);

    return (
        <MessageContext.Provider value={{ currentRoom, setCurrentRoom, isChangeRoom, setIsChangeRoom }}>
            {children}
        </MessageContext.Provider>
    );
};
