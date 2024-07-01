import axios from "axios";
import { usersShow } from "@/urls/index";

export const fetchUser = async ({ userId }) => {
  const url = usersShow(userId);
  const { data } = await axios.get(url);
  return data;
};
