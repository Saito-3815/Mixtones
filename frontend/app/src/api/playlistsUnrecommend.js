import axios from "axios";
import { playlistsUnrecommend } from "@/urls/index";

export const destroyRecommend = ({ communityId, tuneId }) => {
  const url = playlistsUnrecommend(communityId, tuneId);
  return axios.delete(url, {}, { withCredentials: true });
};
