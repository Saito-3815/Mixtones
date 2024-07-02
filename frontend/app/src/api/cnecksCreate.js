import axios from "axios";
import { checksCreate } from "@/urls/index";

export const createCheck = ({ userId, spotify_uri }) => {
  const url = checksCreate(userId);
  return axios.post(
    url,
    {
      check: {
        spotify_uri: spotify_uri,
      },
    },
    { withCredentials: true },
  );
};
