import { uploadFile } from '@/api/upload.api';

export const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<string | void> => {
  e.preventDefault();

  const file = e.target.files?.[0];

  if (file) {
    try {
      const uploadUrl = uploadFile(file);
      return uploadUrl;
    } catch (error) {
      console.log(error);
    }
  }
};
