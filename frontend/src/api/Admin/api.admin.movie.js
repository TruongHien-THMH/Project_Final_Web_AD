import axios  from "axios";

const API_ADMIN_MOVIE = axios.create({baseURL: "http://localhost:5001/api/admin/movie"})

API_ADMIN_MOVIE.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API_ADMIN_MOVIE