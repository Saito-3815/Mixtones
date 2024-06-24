import axios from "axios";
import { membershipsDestroy } from "@/urls/index";

export const destroyMemberships = (communityId, cancelToken) => {
  console.log(`Destroying membership for communityId: ${communityId}`);
  const url = membershipsDestroy(communityId);
  return axios.delete(url, { withCredentials: true, cancelToken });
};
