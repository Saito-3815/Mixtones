import axios from "axios";
import { playlistsRecommend } from "@/urls/index";

export const createRecommend = ({ communityId, tuneId }) => {
  const url = playlistsRecommend(communityId, tuneId);
  return axios.post(url, {}, { withCredentials: true });
};
