import axios, { AxiosError } from 'axios';

//base url
const API_BASE_URL = "http://127.0.0.1:5000";  //backend endpoints

interface ErrorResponse {
  message: string;
}

//login function component
export const login = async (username: string, password: string) => {
  try {//login
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
    return response.data.access_token;
  } catch (error) {//failure
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error(
      'Login failed:',
      axiosError.response?.data?.message || axiosError.message
    );
    throw error;
  }
};

//register function for user
export const register = async (username: string, password: string) => {
  try {
    console.log("Sending request to:", `${API_BASE_URL}/register`);
    console.log("Request data:", { username, password });

    const response = await axios.post(`${API_BASE_URL}/register`, { username, password });

    console.log("Response received:", response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error("Registration failed:", axiosError.response?.data?.message || axiosError.message);
    throw error;
  } 
};
