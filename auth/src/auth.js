// import axios from 'axios';
import axios from "./axiosConfig";

const API_URL = 'http://localhost:8000/api';

// Function to Register the user
export const userRegister = async (username,email,password,phone_number,address) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, {
      username,
      email,
      password,
      phone_number,
      address,
    });
    if (response.status === 201) {
    }
  } catch (error) {
    throw error;  
  }
}

// Function to login the user
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login/`,
      { username, password },
      { withCredentials: true } 
    );
    return response.data;
  } catch (error) {
    throw error;  
  }
};

// Function to get the authenticated user
export const getUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/`, {
      withCredentials: true,  // Ensure cookies (JWT token) are sent with the request
    });
    return response.data;  // Return user data if authenticated
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // If the user is unauthorized, return null
      return null;
    } else {
      throw error;  // Handle other types of errors (e.g., network issues)
    }
  }
};

// Function to logout the user
export const logoutUser = async () => {
  try {
    await axios.post(`${API_URL}/logout/`, {}, {
      withCredentials: true,  // Ensure cookies are sent for logging out
    });
  } catch (error) {
    throw error;
  }
};

// Function to refresh token (if needed manually)
export const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/token/refresh/`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};



// Function to save creative information
export const saveCreativeInfo = async (creativeInfo) => {
  try {
    const response = await axios.post('/api/profile/save/', { creative_info: creativeInfo }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving creative information:', error);
    throw error;
  }
};