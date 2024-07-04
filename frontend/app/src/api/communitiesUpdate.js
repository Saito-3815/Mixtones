import axios from "axios";
import { communitiesUpdate } from "@/urls/index";

export const updateCommunities = (data, communityId) => {
  const url = communitiesUpdate(communityId);
  return axios.put(
    url,
    {
      name: data.communityName,
      playlist_name: data.playlistName,
      introduction: data.introduction,
      avatar: data.image,
    },
    { withCredentials: true },
  );
};
