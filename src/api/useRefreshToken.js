import axiosRefresh from './axiosRefresh';
import { LINK_API } from './const';
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
        const response = await axiosRefresh.post(
            `${LINK_API}/user-management/user/refresh`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            },
        );

        if (response.status === 401) {
            await logout();
        }

        return response.data.data.access_token;
    };
    return refresh;
};

export default useRefreshToken;
