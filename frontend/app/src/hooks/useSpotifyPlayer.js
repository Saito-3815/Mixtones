import { playerAtom } from "@/atoms/playerAtom";
import { tokenAtom } from "@/atoms/tokenAtoms";
import { useAtom } from "jotai";
import { useEffect } from "react"; // useStateをインポート

export function useSpotifyPlayer(setDeviceId) {
  const [access_token] = useAtom(tokenAtom);
  const [, setPlayer] = useAtom(playerAtom);

  useEffect(() => {
    let currentAccessToken = null;

    const isScriptAdded = document.querySelector(
      "script[src='https://sdk.scdn.co/spotify-player.js']",
    );
    if (!isScriptAdded) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      document.body.appendChild(script);
    }

    if (access_token) {
      if (!window.onSpotifyWebPlaybackSDKReady) {
        window.onSpotifyWebPlaybackSDKReady = () => {
          if (access_token !== currentAccessToken) {
            currentAccessToken = access_token;

            const player = new window.Spotify.Player({
              name: "Web Playback SDK Quick Start Player",
              getOAuthToken: (cb) => cb(access_token),
              volume: 0.5,
            });

            setPlayer(player);

            player.addListener("ready", ({ device_id }) => {
              console.log(
                "Ready with Device ID",
                device_id,
                "Type:",
                typeof device_id,
              );
              setDeviceId(device_id);
            });

            player.connect().then((success) => {
              if (success) {
                console.log(
                  "The Web Playback SDK successfully connected to Spotify!",
                );
              }
            });
          }
        };
      }
    }
  }, [access_token]);
}
