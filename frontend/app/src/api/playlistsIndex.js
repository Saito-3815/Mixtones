import axios from "axios";
import { playlistsIndex } from "@/urls/index";

export const fetchPlaylist = async ({ communitiesId }) => {
  const url = playlistsIndex(communitiesId);
  const { data } = await axios.get(url);
  return data;
};
