import { tokenAtom } from "@/atoms/tokenAtoms";
import { useAtom } from "jotai";

export function useMobilePlay(deviceId) {
  const [accessToken] = useAtom(tokenAtom);

  const playMobile = (spotify_uris, startPosition = 0) => {
    if (!accessToken || !deviceId || spotify_uris.length === 0) return;

    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: spotify_uris,
        offset: { position: startPosition },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // レスポンスのステータスとテキストをエラーメッセージに含める
          return response.text().then((text) => {
            throw new Error(
              `Failed to play playlist: ${response.status} ${text}`,
            );
          });
        }
      })
      .catch((error) => console.error(error));
  };

  return playMobile;
}
