import axios from "axios";
import { playlistsIndex } from "@/urls/index";

export const fetchPlaylist = async ({ communityId }) => {
  const url = playlistsIndex(communityId);
  const { data } = await axios.get(url);
  return data;
};
