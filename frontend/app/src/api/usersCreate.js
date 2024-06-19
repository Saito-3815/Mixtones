import axios from "axios";
import { usersCreate } from "@/urls/index";

export const createUser = ({
  code,
  codeVerifier,
  cancelToken,
  isPersistent,
}) => {
  const encodedCode = btoa(code);
  return axios.post(
    usersCreate,
    {
      user: {
        code: encodedCode,
        code_verifier: codeVerifier,
        is_persistent: isPersistent,
      },
    },
    { withCredentials: true, cancelToken },
  );
};
