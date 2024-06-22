import axios from "axios";
import { membershipsCreate } from "@/urls/index";

export const createMemberships = ({ user_id, communitiesId, cancelToken }) => {
  const url = membershipsCreate(communitiesId);
  return axios.post(
    url,
    {
      user_id: user_id,
    },
    { withCredentials: true, cancelToken },
  );
};
