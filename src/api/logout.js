import { useContext } from 'react';
import axios from '../axios';
import { AuthContext } from '../context/authContext';

const useLogout = () => {
    const { setTokenAndUser } = useContext(AuthContext);
    const storedToken = localStorage.getItem('token') || null;
    let refreshToken = '';
    if (storedToken && storedToken !== 'undefined' && storedToken !== 'null' && storedToken.length > 0) {
        const token = JSON.parse(storedToken);

        refreshToken = token.refresh_token;
    }

    const logout = async () => {
        const response = await axios.post(
            '/user-management/user/logout',
            {},
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            },
        );

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
