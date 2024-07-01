import { playerAtom } from "@/atoms/playerAtom";
import { tokenAtom } from "@/atoms/tokenAtoms";
import { isPlayingAtom } from "@/atoms/tuneAtom";
import { useAtom } from "jotai";
import { useCallback } from "react";

// カスタムフックの定義
export function usePlay(deviceId) {
  const [player] = useAtom(playerAtom);
  const [access_token] = useAtom(tokenAtom);
  const [, setIsPlaying] = useAtom(isPlayingAtom);

  // play関数をuseCallbackでメモ化
  const play = useCallback(
    (spotify_uris, startPosition = 0) => {
      if (!player || !access_token || !deviceId) return; // deviceIdの存在も確認

      // deviceIdステートを使用してAPIを呼び出す
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        body: JSON.stringify({
          uris: spotify_uris,
          offset: { position: startPosition },
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Playback failed");
          }
          // レスポンスボディがある場合のみJSONとして解析
          return response.text().then((text) => (text ? JSON.parse(text) : {}));
        })
        .then((data) => {
          setIsPlaying(true);
          if (Object.keys(data).length === 0) {
            console.log("Playback started successfully");
          } else {
            console.log("Playback started", data);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    [player, access_token, deviceId, setIsPlaying],
  ); // 依存配列に追加

  return play;
}
