import { useEffect, useState } from "react";
import { useAtom } from "jotai";
// import Cookies from "js-cookie";
import { userAtom } from "@/atoms/userAtoms";
import { fetchCurrentUser } from "@/api/sessionsCurrentUser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { tokenAtom } from "@/atoms/tokenAtoms";

const useCheckSession = () => {
  const [user, setUser] = useAtom(userAtom);
  const [, setToken] = useAtom(tokenAtom);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 初回ロードを追跡するための状態を追加
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user === null && isInitialLoad) {
      setIsInitialLoad(false); // 初回ロードが完了したら、isInitialLoadをfalseに設定
    }
  }, [user, isInitialLoad]); // 依存配列にisInitialLoadを追加

  const { data: currentUserData, error: currentUserError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const data = await fetchCurrentUser();
        return data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // 404エラーの場合はキャッシュを無効にする
          queryClient.invalidateQueries(["currentUser"]);
        }
        throw error;
      }
    },
    enabled: !user && isInitialLoad,
  });

  useEffect(() => {
    if (currentUserData) {
      console.log("Current user data:", currentUserData);
      setUser(currentUserData.user);
      setToken(currentUserData.access_token);
    }
    if (currentUserError) {
      console.error(currentUserError);
    }
  }, [currentUserData, currentUserError, setUser]);
};

export { useCheckSession };
