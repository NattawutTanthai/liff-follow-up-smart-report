import axios from "axios";

const Axios = axios.create({});

Axios.defaults.baseURL = "http://localhost:3333";
// Axios.defaults.baseURL = "https://api-smart-report.vercel.app";

export default Axios;
