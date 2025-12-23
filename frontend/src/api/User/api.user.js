import axios from "axios";

const API_USER = axios.create({
    baseURL: 'http://localhost:5001/api/user'
});

API_USER.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API_USER;