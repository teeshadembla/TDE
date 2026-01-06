import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/',
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Accept": "application/json, multipart/form-data"
    }
})

export default axiosInstance;