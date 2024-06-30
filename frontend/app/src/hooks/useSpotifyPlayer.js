import { playerAtom } from "@/atoms/playerAtom";
import { tokenAtom } from "@/atoms/tokenAtoms";
import { useAtom } from "jotai";
import { useEffect, useState } from "react"; // useStateをインポート

// カスタムフックの定義、previewUrlを引数に追加
export function useSpotifyPlayer(setDeviceId, previewUrl) {
  const [access_token] = useAtom(tokenAtom);
  const [, setPlayer] = useAtom(playerAtom);
  const [audio, setAudio] = useState(null);

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
    } else if (previewUrl) {
      // access_tokenがない場合はpreviewUrlを使用して再生
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(previewUrl);
      setAudio(newAudio);
      newAudio.play();
    }
  }, [access_token, previewUrl, audio]); // この行を修正した

  // コンポーネントのアンマウント時に音楽の再生を停止
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);
}
