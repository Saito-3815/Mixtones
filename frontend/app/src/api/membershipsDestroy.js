import axios from "axios";
import { membershipsDestroy } from "@/urls/index";

export const destroyMemberships = (userId, communityId, cancelToken) => {
  console.log(
    `Destroying membership for userId: ${userId}, communityId: ${communityId}`,
  );
  const url = membershipsDestroy(communityId, userId);
  return axios.delete(url, { withCredentials: true, cancelToken });
};
