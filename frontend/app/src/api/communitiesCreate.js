import axios from "axios";
import { communitiesCreate } from "@/urls/index";

export const createCommunity = () => {
  return axios.post(
    communitiesCreate,
    {},
    {
      withCredentials: true,
    },
  );
};
