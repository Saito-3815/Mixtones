// api/users.js
import axios from "axios";
import { usersCreate } from "@/urls/index";

export const createUser = ({ code, codeVerifier, cancelToken }) => {
  const encodedCode = btoa(code);
  return axios.post(
    usersCreate,
    { user: { code: encodedCode, code_verifier: codeVerifier } },
    { withCredentials: true, cancelToken },
  );
};
