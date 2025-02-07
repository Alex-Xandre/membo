/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINT } from '@/config/API';
import { handleAxiosError } from '@/config/error-handling';
import USER_API from '@/config/header-api';
import axios from 'axios';

export const registerUser = async (data: any) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/api/auth/register`, data);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const registerUserByAdmin = async (data: any) => {
  try {
    const response = await USER_API.post(`${API_ENDPOINT}/api/auth/add-user`, data);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
