import { Button } from "@/components/ui/Button/Button";
import { Switch } from "@/components/ui/Switch/Switch";
import { generateCodeChallenge } from "@/SpotifyAuth.js";

import { accessUrl } from "@/SpotifyAuth.js";

const Signup = () => {
  // ログインボタンをクリックしたときにコードチャレンジを生成してSpotifyのログインページにリダイレクトする
  const handleLogin = async () => {
    try {
      const { codeChallenge, codeVerifier } = await generateCodeChallenge();
      console.log(`Generated code challenge: ${codeChallenge}`);
      console.log(`Generated code verifier: ${codeVerifier}`);

      // codeVerifierをセッションストレージに保存
      sessionStorage.setItem("codeVerifier", codeVerifier);

      window.location.href = accessUrl;
    } catch (error) {
      console.error("Failed to generate code challenge:", error);
    }
  };

  return (
    <div className="container flex flex-col bg-theme-black max-w-[890px] max-h-[840px] h-full mx-auto my-8 rounded-sm justify-center items-center overflow-hidden">
      <div className="w-full max-w-[550px] mx-auto items-center text-center">
        <h1 className="text-white text-2xl pt-24 ">
          サインアップにはSpotifyへのログインが必要です。
          <br />
          ログインしますか？
        </h1>
        <p className="text-theme-gray pt-12">
          ログインするとSpotifyのユーザープロフィールと「お気に入りの曲」がこのアプリケーションと連携されます。ログイン情報を保持するとSpotifyの更新が自動で連携されます。
          <br />
          ゲストログインすると一部を除いたアプリケーションの全機能が使えるようになります。
        </p>
      </div>
      <div className="w-full max-w-[550px] flex items-center justify-center space-x-10 pt-12">
        <Switch />
        <p className="text-white">ログイン状態を保持する。</p>
      </div>
      <div className="w-full max-w-[550px] flex flex-col items-center space-y-12 pt-12 pb-24">
        <div onClick={handleLogin}>
          <Button
            label="Spotifyでログインする"
            className="bg-theme-green hover:bg-theme-green/90 w-[290px]"
          />
        </div>
        <Button
          label="ゲストログインする"
          className="bg-theme-orange w-[290px]"
        />
      </div>
    </div>
  );
};

export default Signup;
