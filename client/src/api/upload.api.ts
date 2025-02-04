/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleAxiosError } from '@/config/error-handling';
import USER_API from '@/config/header-api';
import toast from 'react-hot-toast';

export const uploadFile = async (file: File) => {
  try {
    const formdata = new FormData();
    formdata.append('docs', file);

    const res = await USER_API.post('/api/upload', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progress) => {
        if (progress.total < 1024000) {
          toast.loading('Uploading');
        }
      },
    });

    toast.dismiss();

    return res.data.url;
  } catch (error) {
    return handleAxiosError(error);
  }
};
