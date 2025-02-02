import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://dnd-survey.up.railway.app/', // Replace with your backend's base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
