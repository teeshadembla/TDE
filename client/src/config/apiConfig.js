import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Accept": "application/json, multipart/form-data"
    }
})

export default axiosInstance;