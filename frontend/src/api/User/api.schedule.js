import axios from "axios";

const API_SCHEDULES = axios.create({baseURL: 'http://localhost:5001/api/schedules'});

export default API_SCHEDULES;