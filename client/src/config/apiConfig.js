import axios from 'axios';

const axiosInstance = axios.create({
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Accept": "application/json, multipart/form-data"
    }
})

export default axiosInstance;