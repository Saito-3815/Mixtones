import axios from "axios";
import { checksIndex } from "@/urls/index";

export const fetchCheckes = async ({ userId }) => {
  const url = checksIndex(userId);
  const { data } = await axios.get(url);
  return data;
};
