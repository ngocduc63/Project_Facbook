import { createContext, useState } from 'react';

export const HomeContext = createContext();

export const HomeContextProvider = ({ children }) => {
    const [isRefetch, setIsRefetch] = useState(false);
    const [userCallData, setUserCallData] = useState(null);
    const [isShowChatPage, setIsShowChatPage] = useState(false);

    const refetchHome = () => {
        setIsRefetch(!isRefetch);
    };

    return (
        <HomeContext.Provider
            value={{ isRefetch, refetchHome, userCallData, setUserCallData, isShowChatPage, setIsShowChatPage }}
        >
            {children}
        </HomeContext.Provider>
    );
};
