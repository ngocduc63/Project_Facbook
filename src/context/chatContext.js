import { createContext, useEffect, useState } from 'react';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const [roomCurrent, setRoomCurrent] = useState('');
    const [dataHiden, setDataHidden] = useState([]);

    const setRoomNoti = (data) => {
        if (roomCurrent) {
            setDataHidden((prev) => {
                const existingItemIndex = prev.findIndex((item) => item.room === data.room);
                if (existingItemIndex !== -1) {
                    const existingItem = prev[existingItemIndex];
                    const updatedPrev = prev.filter((_, index) => index !== existingItemIndex);
                    return [...updatedPrev, existingItem];
                } else {
                    return [...prev, data];
                }
            });
        } else {
            setRoomCurrent(data.room);
        }
    };

    return (
        <ChatContext.Provider value={{ roomCurrent, setRoomCurrent, dataHiden, setDataHidden, setRoomNoti }}>
            {children}
        </ChatContext.Provider>
    );
};
