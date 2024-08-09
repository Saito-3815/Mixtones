import axios from "axios";
import { sessionsCreatePassword } from "@/urls/index";

export const createPasswordSession = (data) => {
  return axios.post(
    sessionsCreatePassword,
    {
      user: {
        email: data.email,
        password: data.password,
        isPersistent: data.isPersistent,
      },
    },
    { withCredentials: true },
  );
};
