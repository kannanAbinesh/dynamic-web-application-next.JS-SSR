/* Plugins. */
import axios from 'axios';
import Cookies from 'js-cookie';

/* Variables. */
const BASE_URL = 'http://localhost:3000';
const axiosInstance = axios.create({ baseURL: BASE_URL, timeout: 30000 });

/* Request handlers. */
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('id_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

/* Reponse handlers. */
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            const currentUrl = window.location.pathname;
            if (status === 401 && currentUrl.includes('/siteadmin')) {
                Cookies.remove('id_token');
                window.location.href = '/login';
            };
        };
        return Promise.reject(error);
    }
);

export default axiosInstance;