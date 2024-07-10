import axios from "axios";
import { communitiesUpdateAvatar } from "@/urls/index";

export const updateCommunitiesAvatar = ({ fileKey, communityId }) => {
  const url = communitiesUpdateAvatar(communityId);
  return axios.put(url, {
    key: fileKey,
  });
};
