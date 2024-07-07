import axios from "axios";
import { imagesCreate } from "@/urls/index";

export const createSignedUrl = (file) => {
  return axios.post(
    imagesCreate,
    {},
    {
      headers: {
        "Content-Type": file.contentType,
      },
      withCredentials: true,
    },
  );
};
