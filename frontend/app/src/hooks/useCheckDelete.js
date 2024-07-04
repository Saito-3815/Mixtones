import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import axios from "axios";
import { loginUser, userAtom } from "@/atoms/userAtoms";
import { destroyCheck } from "@/api/checksDestroy";

export const useCheckDelete = () => {
  const [user, setUser] = useAtom(userAtom);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: destroyCheck,
    onSuccess: (data) => {
      if (user) {
        loginUser(setUser, data.data.user);
        // 現在のキャッシュデータをログに出力
        const currentCache = queryClient.getQueryData(["check_tunes", user.id]);
        console.log("Current cache data:", currentCache);

        // checkTunesDataを最新のデータで更新
        try {
          queryClient.setQueryData(["check_tunes", user.id], data.data.check);
          console.log("Delete success:", data);
        } catch (error) {
          console.error("Error updating query data:", error);
        }
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
