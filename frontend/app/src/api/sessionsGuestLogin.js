import axios from "axios";
import { sessionsGuestLogin } from "@/urls/index";

export const guestLogin = () => {
  return axios.post(sessionsGuestLogin, { withCredentials: true });
};
