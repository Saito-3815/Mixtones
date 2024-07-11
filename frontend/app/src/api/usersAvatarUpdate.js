import axios from "axios";
import { usersUpdateAvatar } from "@/urls/index";

export const updateUsersAvatar = ({ fileKey, userId }) => {
  const url = usersUpdateAvatar(userId);
  return axios.put(url, {
    key: fileKey,
  });
};
