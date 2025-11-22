import axios from "axios";

const API_ADMIN = axios.create({baseURL: 'http://localhost:5001/api/admin/shows'});

export default API_ADMIN;