import axios from "axios";
import { membershipsCreate } from "@/urls/index";

export const createMemberships = ({ userId, communityId, cancelToken }) => {
  const url = membershipsCreate(communityId);
  return axios.post(
    url,
    {
      user_id: userId,
    },
    { withCredentials: true, cancelToken },
  );
};
