import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import axios from "axios";
import { loginUser, userAtom } from "@/atoms/userAtoms";
import { createCheck } from "@/api/cnecksCreate";

export const useCheck = () => {
  const [user, setUser] = useAtom(userAtom);

  return useMutation({
    mutationFn: createCheck,
    onSuccess: (data) => {
      if (user) {
        loginUser(setUser, data.data.user);
        console.log("Check success:", data);
      }
    },
    onError: (error) => {
      if (axios.isCancel(error)) {
        console.log("Request was canceled by the user");
      } else {
        console.error(error);
      }
    },
  });
};
