import { createContext, useState } from 'react';

export const HomeContext = createContext();

export const HomeContextProvider = ({ children }) => {
    const [isRefetch, setIsRefetch] = useState(false);

    const refetchHome = () => {
        setIsRefetch(!isRefetch);
    };

    return <HomeContext.Provider value={{ isRefetch, refetchHome }}>{children}</HomeContext.Provider>;
};
