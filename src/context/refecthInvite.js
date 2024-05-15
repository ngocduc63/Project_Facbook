import { createContext, useState } from 'react';

export const RefecthInviteContext = createContext();

export const RefecthInviteContextProvider = ({ children }) => {
    const [isRefecthInvite, setIsRefecthInvite] = useState(false);

    const toggle = () => {
        setIsRefecthInvite(!isRefecthInvite);
    };

    return (
        <RefecthInviteContext.Provider value={{ isRefecthInvite, toggle }}>{children}</RefecthInviteContext.Provider>
    );
};
