import axios from "axios";

// The browser app talks to the backend base URL from the environment.
// This can be an AWS EC2 public URL such as https://api.example.com/api.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api"
});

// Attach the JWT to every normal API request, but skip auth headers for public OAuth endpoints.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const isPublicRoute = /oauth|Auth\/login/i.test(config.url || "");

    if (token && !isPublicRoute) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// If the backend rejects a request as unauthorized, clear the local auth state and send the user back to login.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location.assign("/");
        }

        return Promise.reject(error);
    }
);

export default api;