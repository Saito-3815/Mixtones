import axios from "axios";
import { usersUpdate } from "@/urls/index";

export const updateUsers = (data, userId) => {
  const url = usersUpdate(userId);
  return axios.put(
    url,
    {
      name: data.name,
      introduction: data.introduction,
    },
    { withCredentials: true },
  );
};
