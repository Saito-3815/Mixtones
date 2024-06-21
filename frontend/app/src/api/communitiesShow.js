import axios from "axios";
import { communitiesShow } from "@/urls/index";

export const fetchCommunity = async ({ communitiesId }) => {
  const url = communitiesShow(communitiesId);
  const { data } = await axios.get(url);
  return data;
};
