import axios from "axios";

const API_ADMIN_STATS = axios.create({
    baseURL: 'http://localhost:5001/api/admin/stats'
});

API_ADMIN_STATS.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API_ADMIN_STATS;