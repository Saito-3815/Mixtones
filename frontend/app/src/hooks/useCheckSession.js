import { useEffect } from "react";
import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { userAtom } from "@/atoms/userAtoms";
import { fetchCurrentUser } from "@/api/sessionsCurrentUser";
import { useQuery } from "@tanstack/react-query";

// セッションをチェックしてユーザー情報を取得するカスタムフック
const useCheckSession = () => {
  const [user, setUser] = useAtom(userAtom);
  const sessionCookie = Cookies.get("session_cookie_name");

  const { data: currentUserData, error: communitiesError } = useQuery(
    ["currentUser"],
    fetchCurrentUser,
    {
      enabled: !!sessionCookie && !user, // セッションクッキーがあり、userがnullの場合にのみクエリを実行
    },
  );

  useEffect(() => {
    if (currentUserData) {
      setUser(currentUserData); // フェッチしたデータをuserAtomにセット
    }
    if (communitiesError) {
      // エラーハンドリング
      console.error(communitiesError);
    }
  }, [currentUserData, communitiesError, setUser]);
};

export { useCheckSession };
