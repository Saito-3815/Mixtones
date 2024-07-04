import axios from "axios";
import { checksDestroy } from "@/urls/index";

export const destroyCheck = ({ userId, spotify_uri }) => {
  const url = checksDestroy(userId);
  return axios.delete(url, {
    data: {
      check: {
        spotify_uri: spotify_uri,
      },
    },
    withCredentials: true,
  });
};
