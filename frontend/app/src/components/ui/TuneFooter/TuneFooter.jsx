import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faCircleCheck,
  faForwardStep,
  faRepeat,
  faShuffle,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { Slider } from "@/components/ui/Slider/Slider";
import { Progress } from "@/components/ui/Progress/Progress";
import { ColorIcon } from "@/components/ui/ColorIcon/ColorIcon";
import { PlayIcon } from "../PlayIcon/PlayIcon";
import { useAtom } from "jotai";
import { isPlayingAtom, tuneAtom } from "@/atoms/tuneAtom";
import { tokenAtom } from "@/atoms/tokenAtoms";
import { playerAtom } from "@/atoms/playerAtom";
import { playlistAtom } from "@/atoms/playlistAtom";

export const TuneFooter = () => {
  const [tune, setTune] = useAtom(tuneAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [access_token] = useAtom(tokenAtom);
  const [player, setPlayer] = useAtom(playerAtom);
  const [playlistData] = useAtom(playlistAtom);

  const [deviceId, setDeviceId] = useState(null);
  const [shuffleMode, setShuffleMode] = useState(false);

  const tuneNameRef = useRef(null);
  const tuneArtistRef = useRef(null);

  // 次のトラックを取得
  const nextTrack = () => {
    let nextIndex = tune.index + 1; // tune.indexを増やす前に次のインデックスを計算
    if (nextIndex >= playlistData.length) {
      // playlistDataの範囲を超えるかチェック
      nextIndex = 0; // 範囲を超える場合は最初に戻る
    }
    tune.index = nextIndex; // tune.indexを更新
    return { index: tune.index, tune: playlistData[nextIndex] }; // 更新されたインデックスでplaylistDataからトラックを返す
  };

  // 前のトラックを取得
  const prevTrack = () => {
    let prevIndex = tune.index - 1; // tune.indexを減らす前に前のインデックスを計算
    if (prevIndex < 0) {
      // 0未満になるかチェック
      prevIndex = playlistData.length - 1; // 0未満になる場合は最後に戻る
    }
    tune.index = prevIndex; // tune.indexを更新
    return { index: tune.index, tune: playlistData[prevIndex] }; // 更新されたインデックスでplaylistDataからトラックを返す
  };

  // シャッフルモードに切り替え
  const setShuffle = async (state) => {
    if (!access_token || !deviceId) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/shuffle?state=${state}&device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Shuffle mode setting failed");
      }
      console.log("Shuffle mode set to", state);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // async function fetchShuffledPlaylist() {
  //   if (!access_token) return;

  //   try {
  //     const response = await fetch(
  //       `https://api.spotify.com/v1/me/player/queue?uri=spotify:playlist:37i9dQZF1DXcBWIGoYBM5M`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Shuffled playlist fetching failed");
  //     }

  //     const data = await response.json();
  //     console.log("Shuffled playlist fetched", data);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }

  // プレイリストデータからSpotify URIを取得
  const spotifyUris = playlistData.map((track) => track.spotify_uri);

  // 指定されたSpotify URIの曲を再生
  const play = (spotify_uris, startPosition = 0) => {
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
  };

  useEffect(() => {
    console.log("IsPlayingAtom is now", isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    console.log("shuffleMode", shuffleMode);
  }, [shuffleMode]);

  // シャッフル再生を開始する
  const playWithShuffle = (spotify_uris, startPosition = 0) => {
    // まずシャッフルを有効にする
    setShuffle(true).then(() => {
      // シャッフルが有効になった後、曲を再生する
      play(spotify_uris, startPosition);
    });
  };

  // アクセストークンが変更されたときにSpotify Web Playback SDKを初期化
  useEffect(() => {
    let currentAccessToken = null; // 現在のアクセストークンを保持する

    // Spotify Web Playback SDK スクリプトが既に追加されているかチェック
    const isScriptAdded = document.querySelector(
      "script[src='https://sdk.scdn.co/spotify-player.js']",
    );
    if (!isScriptAdded) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      document.body.appendChild(script);
    }

    // onSpotifyWebPlaybackSDKReady が既に設定されているかチェック
    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        if (access_token !== currentAccessToken) {
          // アクセストークンが更新されたかチェック
          currentAccessToken = access_token; // 現在のアクセストークンを更新

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
  }, [access_token]); // 依存配列にaccess_tokenを追加

  // tuneが変更されたときに音楽を再生する
  useEffect(() => {
    if (tune && tune.tune.spotify_uri && player && deviceId) {
      console.log(`Attempting to play tune on device with ID: ${deviceId}`);
      if (shuffleMode) {
        // シャッフルモードが有効な場合
        playWithShuffle(spotifyUris, tune.index);
      } else {
        play(spotifyUris, tune.index);
      }
    } else {
      console.log(`Unable to play tune. Device ID: ${deviceId}`);
    }
  }, [tune, player, deviceId, shuffleMode]);

  // 再生時間をフォーマット（ミリ秒対応）
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <footer className="mx-1 my-1">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center bg-theme-black rounded-sm md:h-[72px]">
        {/* 楽曲データ */}
        <div className="flex flex-grow flex-shrink justify-start items-center space-x-3 pr-5 col-span-3 md:col-span-1 py-3 lg:py-0">
          <img
            src={`${tune.tune.images}`}
            alt="images"
            className="object-cover h-12 w-12 bg-theme-gray rounded-sm ml-3"
          />
          <div className="max-w-full overflow-hidden">
            <h1
              ref={tuneNameRef}
              className="text-white text-sm font-extralight whitespace-nowrap overflow-x-visible"
            >{`${tune.tune.name}`}</h1>
            <h2
              ref={tuneArtistRef}
              className="text-theme-gray text-xs font-extralight whitespace-nowrap overflow-x-visible"
            >{`${tune.tune.artist}`}</h2>
          </div>
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-white hidden md:flex"
          />
        </div>
        {/* 再生コントロール */}
        <div className="flex-grow flex-shrink justify-center items-center col-span-3 md:col-span-1 md:flex px-3 md:px-0">
          <div className="items-center w-full">
            <div className="flex justify-center items-center space-x-5 mt-2">
              <ColorIcon
                icon={faShuffle}
                onClick={() => {
                  setShuffleMode(!shuffleMode);
                }}
              />
              <FontAwesomeIcon
                icon={faBackwardStep}
                className="h-4 w-4 text-theme-white hover:text-white active:text-theme-white"
                onClick={() => {
                  player.previousTrack();
                  setTune(prevTrack());
                }}
              />
              <PlayIcon
                color="text-white"
                size="8"
                onClick={() => {
                  player.togglePlay();
                }}
              />
              <FontAwesomeIcon
                icon={faForwardStep}
                className="h-4 w-4 text-theme-white hover:text-white active:text-theme-white"
                onClick={() => {
                  player.nextTrack();
                  setTune(nextTrack());
                }}
              />
              <ColorIcon icon={faRepeat} />
            </div>
            <div className="flex flex-grow flex-shrink items-center space-x-2 mt-1">
              <span className="text-theme-gray text-xs font-extralight">
                {formatTime(tune.tune.time)}
              </span>
              <Progress value={33} className="" />
              <span className="text-theme-gray text-xs font-extralight">
                {formatTime(tune.tune.time)}
              </span>
            </div>
          </div>
        </div>
        {/* 音量調整 */}
        <div className="flex-grow flex-shrink justify-end items-center hidden md:flex">
          <div className="flex flex-grow flex-shrink justify-end items-center space-x-3 mr-10">
            <FontAwesomeIcon icon={faVolumeHigh} className="text-white" />
            <Slider defaultValue={[33]} max={100} step={1} className="w-28" />
          </div>
        </div>
      </div>
    </footer>
  );
};

TuneFooter.propTypes = {
  tune: PropTypes.shape({
    name: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    album: PropTypes.string.isRequired,
    images: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }),
};

TuneFooter.defaultProps = {
  tune: null,
};
