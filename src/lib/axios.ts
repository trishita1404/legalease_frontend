import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const api = axios.create({
  baseURL: "https://legalease-backend-d2yt.onrender.com/api/v1",
  withCredentials: true,
});

// ===============================
// ✅ REQUEST INTERCEPTOR (FIXED)
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // 🔥 use Zustand

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// ✅ RESPONSE INTERCEPTOR (FIXED)
// ===============================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 🚨 Retry only once
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "https://legalease-backend-d2yt.onrender.com/api/v1/users/refresh-token",
          {},
          { withCredentials: true }
        );

        if (res.data?.status === "success") {
          const newToken = res.data.accessToken;

          // ✅ SAVE IN ZUSTAND (IMPORTANT)
          useAuthStore.setState({ token: newToken, isAuthenticated: true });

          // ✅ Attach new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // 🔁 Retry request
          return api(originalRequest);
        }

      } catch (refreshError) {
        console.error("Refresh token failed");

        // ❌ logout if refresh fails
        useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;