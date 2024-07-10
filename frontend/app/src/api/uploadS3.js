import axios from "axios";

export const uploadS3 = async ({ file, url }) => {
  return await axios.put(url, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
};
