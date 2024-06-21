import axios from "axios";
import { sessionsCreate } from "@/urls/index";

export const createSessions = ({
  code,
  codeVerifier,
  cancelToken,
  isPersistent,
}) => {
  const encodedCode = btoa(code);
  return axios.post(
    sessionsCreate,
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
