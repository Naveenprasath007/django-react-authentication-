import axios from 'axios';

// Set the base URL for Axios requests
axios.defaults.baseURL = 'http://localhost:8000';  // Your Django backend URL
axios.defaults.withCredentials = true;  // Ensure cookies are sent with requests

// Axios interceptor for handling token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired access token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Send a request to refresh the token using the refresh token stored in cookies
        const refreshResponse = await axios.post('/api/token/refresh/', {}, {
          withCredentials: true,  // Send cookies with the request
        });

        // Update the access token in the Authorization header for future requests
        const newAccessToken = refreshResponse.data.access;
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);

      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Set default headers (if needed)
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;
