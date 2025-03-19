import axiosConfig from "@/services/instance";

/**
 * Axios Base Query for RTK Query or standalone usage
 * @param {Object} options - Configuration options
 * @param {string} options.baseUrl - Base URL for the API
 * @returns {Function} - A function to handle API requests
 */
export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method = "GET", data = null, params = null }) => {
    // Validate the URL
    if (!url || url.includes("undefined")) {
      console.warn(`Invalid request URL: ${url}`);
      return { error: { status: 400, data: "Invalid request URL" } };
    }

    try {
      // Make the API request
      const response = await axiosConfig({
        url: baseUrl + url,
        method,
        data,
        params,
      });

      // Return the response data
      return { data: response.data };
    } catch (error) {
      // Handle errors from Axios
      return {
        error: {
          status: error.status || error.response?.status || 500,
          data: error.response?.data || error.message || "An error occurred",
        },
      };
    }
  };
