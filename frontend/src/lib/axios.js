import axios from "axios";

const axiosInstance = axios.create({
    baseURL:
        import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true, // REQUIRED — sends the httpOnly cookie
});

export default axiosInstance;