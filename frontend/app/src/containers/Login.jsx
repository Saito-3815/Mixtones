import { Button } from "@/components/ui/Button/Button";
import { Switch } from "@/components/ui/Switch/Switch";

const Login = () => {
  return (
    <div className="bg-theme-black w-[890px] h-[840px] mx-auto my-8 rounded-sm justify-center text-center">
      <div className="w-[550px] mx-auto">
        <h1 className="text-white text-2xl pt-24">
          Spotifyへログインしますか？
        </h1>
        <p className="text-theme-gray pt-12">
          ログインすると最新のSpotifyのユーザープロフィールと「お気に入りの曲」がこのアプリケーションと連携されます。ログイン情報を保持するとSpotifyの更新が自動で連携されます。
          <br />
          ゲストログインすると一部を除いたアプリケーションの全機能が使えるようになります。
        </p>
      </div>
      <div className="flex items-center justify-center space-x-10 pt-12">
        <Switch />
        <p className="text-white">ログイン状態を保持する。</p>
      </div>
      <div className="flex flex-col items-center space-y-12 pt-12">
        <Button
          label="Spotifyでログインする"
          className="bg-theme-green hover:bg-theme-green/90 w-[290px]"
        />
        <Button
          label="ゲストログインする"
          className="bg-theme-orange w-[290px]"
        />
      </div>
    </div>
  );
};

export default Login;
