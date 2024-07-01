import { tokenAtom } from "@/atoms/tokenAtoms";
import { useAtom } from "jotai";
import { useEffect } from "react";

export function useMobilePlayer(setDeviceId) {
  const [accessToken] = useAtom(tokenAtom);

  useEffect(() => {
    if (!accessToken) {
      console.log("アクセストークンがありません。");
      return;
    }

    fetch("https://api.spotify.com/v1/me/player/devices", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`サーバーエラー: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const activeDevice = data.devices.find((device) => device.is_active);
        if (activeDevice) {
          setDeviceId(activeDevice.id);
        } else {
          console.log(
            "アクティブなデバイスが見つかりません。Spotifyアプリを開いていることを確認してください。",
          );
          // ここでデフォルトのデバイスIDを設定するか、ユーザーにアクションを促すメッセージを表示することができます。
          // 例: setDeviceId('デフォルトデバイスID');
        }
      })
      .catch((error) =>
        console.error("デバイスIDの取得中にエラーが発生しました:", error),
      );
  }, [accessToken]);
}
