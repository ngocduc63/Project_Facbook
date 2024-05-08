import axios from '../axios';
import useLogout from './logout';

const useRefreshToken = () => {
    const logout = useLogout();
    const storedToken = localStorage.getItem('token') || null;
    let refreshToken = '';
    if (storedToken && storedToken !== 'undefined' && storedToken !== 'null' && storedToken.length > 0) {
        const token = JSON.parse(storedToken);

        refreshToken = token.refresh_token;
    }

    const refresh = async () => {
        const response = await axios.post(
            '/user-management/user/refresh',
            {},
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            },
        );

        if (response.status === 401) {
            const isSuccess = await logout();
            if (isSuccess) return;
            else return refresh;
        }

        return response.data.data.access_token;
    };
    return refresh;
};

export default useRefreshToken;
