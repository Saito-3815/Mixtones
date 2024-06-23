import axios from "axios";
import { communitiesShow } from "@/urls/index";

export const fetchCommunity = async ({ communityId }) => {
  const url = communitiesShow(communityId);
  const { data } = await axios.get(url);
  return data;
};
