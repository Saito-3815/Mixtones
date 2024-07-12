import { useEffect, useState } from "react";
import axios from "axios";
import { getCodeFromUrl } from "@/SpotifyAuth";

function useBackgroundLogin(userCreate, userLogin) {
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    (async function login() {
      if (isRequesting) return; // 既にリクエストが進行中の場合は何もしない

      const code = getCodeFromUrl();
      const codeVerifier = sessionStorage.getItem("codeVerifier");

      if (window.location.search.includes("code=") && code && codeVerifier) {
        const redirectFrom = sessionStorage.getItem("redirectFrom");
        const isPersistent = sessionStorage.getItem("isPersistent");
        const source = axios.CancelToken.source();

        setIsRequesting(true); // リクエスト開始前に状態を更新

        try {
          if (redirectFrom === "signupPage") {
            await userCreate.mutateAsync({
              code,
              codeVerifier,
              isPersistent,
              cancelToken: source.token,
            });
          } else if (redirectFrom === "loginPage") {
            await userLogin.mutateAsync({
              code,
              codeVerifier,
              isPersistent,
              cancelToken: source.token,
            });
          }
          // 成功した後、認証コードとcodeVerifierを削除する
          sessionStorage.removeItem("code");
          sessionStorage.removeItem("codeVerifier");
        } catch (error) {
          console.error("Login failed:", error);
        } finally {
          setIsRequesting(false); // リクエストが終了したら状態を更新
        }
      }
    })();
  }, []); // この行を修正: useEffectがマウント時にのみ実行されるように空の依存配列を追加

  return { isRequesting };
}

export default useBackgroundLogin;
