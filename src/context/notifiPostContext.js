import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/authContext';

export const NotifiPostContext = createContext();

export const NotifiPostContextProvider = ({ children }) => {
    const [data, setData] = useState({});
    const [postId, setPostId] = useState('');
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (!currentUser) return;
        if (!data.hasOwnProperty('mess')) return;
        if (!data.hasOwnProperty('num_share')) {
            if (!data || data === null || data.mess === 'un_like') return;
            if (data.create_post !== currentUser.id || data.user_id === currentUser.id) return;
        }

        toast.info(`${data.user_name} ${data.mess}`, {
            position: 'bottom-left',
            onOpen: () => {
                setPostId(data.post_id);
            },
        });
    }, [data, currentUser]);

    return <NotifiPostContext.Provider value={{ data, setData, postId }}>{children}</NotifiPostContext.Provider>;
};
