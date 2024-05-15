import { createContext, useState } from 'react';

export const HomeContext = createContext();

export const HomeContextProvider = ({ children }) => {
    const [isRefetch, setIsRefetch] = useState(false);
    const [userCallData, setUserCallData] = useState(null);
    const [isShowChatPage, setIsShowChatPage] = useState(false);
    const [isShowPopupPost, setIsShowPopupPost] = useState(false);
    const [currentPost, setCurrentPost] = useState();

    const refetchHome = () => {
        setIsRefetch(!isRefetch);
        setIsShowPopupPost(false);
    };

    return (
        <HomeContext.Provider
            value={{
                isRefetch,
                refetchHome,
                userCallData,
                setUserCallData,
                isShowChatPage,
                setIsShowChatPage,
                isShowPopupPost,
                setIsShowPopupPost,
                currentPost,
                setCurrentPost,
            }}
        >
            {children}
        </HomeContext.Provider>
    );
};
