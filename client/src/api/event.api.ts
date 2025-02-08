import { API_ENDPOINT } from '@/config/API';
import { handleAxiosError } from '@/config/error-handling';
import USER_API from '@/config/header-api';
import { EventTypes } from '@/helpers/types';

export const registerEvents = async (data: EventTypes) => {
  try {
    const response = await USER_API.post(`${API_ENDPOINT}/api/event/add-event`, data);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};





export const getAllEvents = async () => {
  try {
    const response = await USER_API.get(`/api/event/events`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
