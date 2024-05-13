import axios from 'axios';

const axiosRefresh = axios.create();

axiosRefresh.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            return error.response;
        }
        // Trả về lỗi nếu không phải là lỗi 401
        return Promise.reject(error);
    },
);

export default axiosRefresh;
