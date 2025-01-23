/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINT } from '@/config/API';
import { handleAxiosError } from '@/config/error-handling';
import axios from 'axios';

export const activateUser = async (data: any) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/api/auth/activate`, data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
