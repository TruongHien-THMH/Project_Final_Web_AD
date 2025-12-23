import axios  from "axios";

const API_BOOK = axios.create({baseURL: 'http://localhost:5001/api/book'});

API_BOOK.interceptors.request.use((req) => {
    const token = localStorage.getItem('token'); 
    
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API_BOOK;