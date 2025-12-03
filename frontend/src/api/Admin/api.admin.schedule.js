import axios from "axios";

const API_ADMIN_SCHEDULES = axios.create({baseURL: 'http://localhost:5001/api/admin/schedules' });

export default API_ADMIN_SCHEDULES;