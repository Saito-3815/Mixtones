// src/api/communities.js
import axios from "axios";
import { communitiesIndex } from "@/urls/index";

export const fetchCommunities = async () => {
  const { data } = await axios.get(communitiesIndex);
  return data;
};
