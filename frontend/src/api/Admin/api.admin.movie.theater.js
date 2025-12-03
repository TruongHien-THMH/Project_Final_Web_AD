import axios from "axios";

const API_ADMIN_MOVIE_THEATER = axios.create({baseURL: 'http://localhost:5001/api/admin/movie_theater'});

export default API_ADMIN_MOVIE_THEATER