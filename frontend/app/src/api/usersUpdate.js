import axios from "axios";
import { usersUpdate } from "@/urls/index";

export const updateUsers = (data, userId) => {
  const url = usersUpdate(userId);
  return axios.put(
    url,
    {
      name: data.ame,
      introduction: data.introduction,
    },
    { withCredentials: true },
  );
};
