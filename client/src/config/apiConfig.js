import axios from 'axios';
const API_URL = import.meta.env.VITE_ENVIRONMENT === "development" ? "http://localhost:8080" : "";

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Accept": "application/json, multipart/form-data"
    }
})

export default axiosInstance;