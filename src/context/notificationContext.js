import { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
    const [countNotification, setCountNotification] = useState(0);

    return (
        <NotificationContext.Provider value={{ countNotification, setCountNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
