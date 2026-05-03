import axios from "axios";
import { BASE_URL } from "../../utils/constants.js"

axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
