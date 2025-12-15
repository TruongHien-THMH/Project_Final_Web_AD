import axios  from "axios";

const API_BOOK = axios.create({baseURL: 'http://localhost:5001/api/book'});

export default API_BOOK;