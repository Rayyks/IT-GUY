import axios from "axios";
import Cookies from "js-cookie";

// Create an Axios instance
const axiosConfig = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

// List of API endpoints that do not require a token
const tokenExemptEndpoints = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify-otp",
  "/api/auth/resend-verification",
];

// Request Interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    // Check if the request URL matches any of the exempt endpoints
    const isExempt = tokenExemptEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // Attach Authorization token if the endpoint is not exempt
    if (!isExempt) {
      const token = Cookies.get("_user_access_token_");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // Set Content-Type based on request data
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    // // Add custom headers if needed
    // config.headers["X-Custom-Header"] = "CustomHeaderValue";

    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosConfig.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`Response [${response.status}]:`, response);
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Map status codes to custom error messages
      const errorMessages = {
        400: "Bad request. Please check your input.",
        401: "Unauthorized. Please log in again.",
        403: "Access forbidden. You do not have the required permissions.",
        404: "The requested resource was not found.",
        500: "Internal server error. Please try again later.",
      };

      const customMessage =
        errorMessages[status] || "An unexpected error occurred.";

      console.error(`API Error [${status}]:`, data.message || customMessage);

      // Reject with a structured error object
      return Promise.reject({
        success: false,
        message: data.message || customMessage,
        data: data || null,
        status,
      });
    }

    // Handle network or unknown errors
    console.error("Network or Unknown Error:", error.message);
    return Promise.reject({
      success: false,
      message:
        "Server is unreachable. Please check your internet connection. (ROOOOORRR ERRRORRRR RRRRRRR, MAHLUK INI BIASANYA KELUAR DI SAAT KONEKSI INTERNET KAMU BURUK)",
      data: null,
      status: 0,
    });
  }
);

export default axiosConfig;
