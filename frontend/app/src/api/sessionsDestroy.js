import axios from "axios";
import { sessionsDestroy } from "@/urls/index";

export const destroySessions = ({ cancelToken }) => {
  return axios.delete(sessionsDestroy, { withCredentials: true, cancelToken });
};
