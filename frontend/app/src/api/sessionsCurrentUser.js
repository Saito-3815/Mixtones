import axios from "axios";
import { currentUser } from "@/urls/index";

export const fetchCurrentUser = async () => {
  const { data } = await axios.get(currentUser, {
    withCredentials: true, // セッションクッキーをリクエストに含める
  });
  return data;
};
