import { useContext } from 'react';
import axios from '../axios';
import { AuthContext } from '../context/authContext';
import { LINK_API } from './const';
const useLogout = () => {
    const { token, setTokenAndUser } = useContext(AuthContext);
    const storedToken = localStorage.getItem('token') || null;
    let refreshToken = '';
    if (storedToken && storedToken !== 'undefined' && storedToken !== 'null' && storedToken.length > 0) {
        const token_data = JSON.parse(storedToken);

        refreshToken = token_data.refresh_token;
    }

    const logout = async () => {
        if (!refreshToken) {
            refreshToken = token.refresh_token;
        }
        const response = await fetch(`${LINK_API}user-management/user/logout`, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshToken}`,
            },
        });
        if (response.status === 200) {
            setTokenAndUser(null, null);
            return true;
        } else if (response.status === 400) {
            return false;
        }
    };
    return logout;
};

export default useLogout;
