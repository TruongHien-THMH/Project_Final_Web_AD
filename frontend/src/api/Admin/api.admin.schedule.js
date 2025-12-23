import axios from "axios";

const API_ADMIN_SCHEDULES = axios.create({baseURL: 'http://localhost:5001/api/admin/schedules' });

API_ADMIN_SCHEDULES.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API_ADMIN_SCHEDULES;