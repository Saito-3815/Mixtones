import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import axios from "axios";
import { loginUser, userAtom } from "@/atoms/userAtoms";
import { guestLogin } from "@/api/sessionsGuestLogin";

export const useGuestLogin = () => {
  const [user, setUser] = useAtom(userAtom);

  return useMutation({
    mutationFn: guestLogin,
    onSuccess: (data) => {
      if (!user) {
        loginUser(setUser, data.data.user);
        console.log("Guest login success:", data.data.user);
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
