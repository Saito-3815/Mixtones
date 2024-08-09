import { Button } from "@/components/ui/Button/Button.jsx";
import { Switch } from "@/components/ui/Switch/Switch";
import { useGuestLogin } from "@/hooks/useGuestLogin";
import { generateCodeChallenge } from "@/SpotifyAuth.js";

import { accessUrl } from "@/SpotifyAuth.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  // isPersistent状態を追加
  const [isPersistent, setIsPersistent] = useState(false);

  // Switchの状態を切り替える関数
  const toggleIsPersistent = () => {
    setIsPersistent(!isPersistent);
  };
  // isPersistentの状態を監視してログに表示
  useEffect(() => {
    console.log("isPersistent:", isPersistent);
  }, [isPersistent]);

  // ログインボタンをクリックしたときにコードチャレンジを生成してSpotifyのログインページにリダイレクトする
  const handleSignup = async () => {
    try {
      const { codeVerifier } = await generateCodeChallenge();
      sessionStorage.setItem("codeVerifier", codeVerifier);
      sessionStorage.setItem("redirectFrom", "signupPage");
      sessionStorage.setItem("isPersistent", isPersistent);

      window.location.href = accessUrl;
    } catch (error) {
      console.error("Failed to generate code challenge:", error);
    }
  };

  // ゲストログイン
  const guestLogin = useGuestLogin();
  const handleGuestLogin = () => {
    guestLogin.mutate();
  };

  return (
    <div className="container flex flex-col bg-theme-black max-w-[890px] max-h-[940px] h-full mx-auto my-8 rounded-sm justify-center items-center overflow-hidden">
      <div className="w-full max-w-[550px] mx-auto items-center text-center">
        <h1 className="text-white text-2xl pt-24 ">
          サインアップにはSpotifyへのログインが必要です。
          <br />
          ログインしますか？
        </h1>
        <p className="text-theme-gray pt-12">
          SpotifyでログインするとSpotifyのユーザープロフィールと「お気に入りの曲」がこのアプリケーションと連携されます。Mixtonesに定期的にログインすることでSpotify上のアクティビティを自動で取得します。なお、この機能を利用する場合はSpotiifyのプレミアムプランに加入する必要があります。
          <br />
          emailでログインすると、あなたのemailとパスワードをMixtonesに登録します。emailでログインする場合は、楽曲のフル再生などのSpotifyと連携した一部機能が制限されます。
          <br />
          ゲストログインすると一部を除いたemailログイン時に利用できるアプリケーションの全機能が使えるようになります。
        </p>
      </div>
      <div className="w-full max-w-[550px] flex items-center justify-center space-x-10 pt-12">
        <Switch checked={isPersistent} onChange={toggleIsPersistent} />
        <p className="text-white">ログイン状態を保持する。</p>
      </div>
      <div className="w-full max-w-[550px] flex flex-col items-center space-y-12 pt-12 pb-24">
        <div onClick={handleSignup}>
          <Button
            label="Spotifyでログインする"
            className="bg-theme-green hover:bg-theme-green/90 w-[290px]"
          />
        </div>
        <Link to="/passsignup" state={{ isPersistent }}>
          <Button
            label="emailでログインする"
            className="bg-theme-orange hover:bg-theme-orange/90 w-[290px]"
          />
        </Link>
        <Button
          label="ゲストログインする"
          className="w-[290px]"
          variant="secondary"
          onClick={handleGuestLogin}
        />
      </div>
    </div>
  );
};

export default Signup;
