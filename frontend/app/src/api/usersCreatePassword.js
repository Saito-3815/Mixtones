import axios from "axios";
import { usersCreatePassword } from "@/urls/index";

export const createPasswordUser = (data) => {
  return axios.post(
    usersCreatePassword,
    {
      user: {
        name: data.name,
        email: data.email,
        password: data.password,
        isPersistent: data.isPersistent,
      },
    },
    { withCredentials: true },
  );
};
