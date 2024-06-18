import axios from "axios";
import { sessionsCreate } from "@/urls/index";

export const createSessions = ({ code, codeVerifier, cancelToken }) => {
  const encodedCode = btoa(code);
  return axios.post(
    sessionsCreate,
    { user: { code: encodedCode, code_verifier: codeVerifier } },
    { withCredentials: true, cancelToken },
  );
};
