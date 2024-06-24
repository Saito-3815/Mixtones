import axios from "axios";
import { communitiesCreate } from "@/urls/index";

export const createCommunity = ({ userId, communityId, cancelToken }) => {
  const url = communitiesCreate(communityId);
  return axios.post(
    url,
    {
      user_id: userId,
    },
    { withCredentials: true, cancelToken },
  );
};
