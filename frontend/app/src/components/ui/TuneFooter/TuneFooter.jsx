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

export const TuneFooter = () => {
  const [tune] = useAtom(tuneAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [access_token] = useAtom(tokenAtom);
  const [player, setPlayer] = useAtom(playerAtom);
  const [deviceId, setDeviceId] = useState(null);

  const tuneNameRef = useRef(null);
  const tuneArtistRef = useRef(null);

  const play = (spotify_uri) => {
    if (!player || !access_token || !deviceId) return; // deviceIdの存在も確認

    // deviceIdステートを使用してAPIを呼び出す
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [spotify_uri] }),
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
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
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
    };
  }, [access_token]);

  // tuneが変更されたときに音楽を再生する
  useEffect(() => {
    if (tune && tune.spotify_uri && player && deviceId) {
      console.log(`Attempting to play tune on device with ID: ${deviceId}`);
      play(tune.spotify_uri, deviceId);
    } else {
      console.log(`Unable to play tune. Device ID: ${deviceId}`);
    }
  }, [tune, player, deviceId]);

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
            src={`${tune.images}`}
            alt="images"
            className="object-cover h-12 w-12 bg-theme-gray rounded-sm ml-3"
          />
          <div className="max-w-full overflow-hidden">
            <h1
              ref={tuneNameRef}
              className="text-white text-sm font-extralight whitespace-nowrap overflow-x-visible"
            >{`${tune.name}`}</h1>
            <h2
              ref={tuneArtistRef}
              className="text-theme-gray text-xs font-extralight whitespace-nowrap overflow-x-visible"
            >{`${tune.artist}`}</h2>
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
              <ColorIcon icon={faShuffle} />
              <FontAwesomeIcon
                icon={faBackwardStep}
                className="h-4 w-4 text-theme-white hover:text-white active:text-theme-white"
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
              />
              <ColorIcon icon={faRepeat} />
            </div>
            <div className="flex flex-grow flex-shrink items-center space-x-2 mt-1">
              <span className="text-theme-gray text-xs font-extralight">
                {formatTime(tune.time)}
              </span>
              <Progress value={33} className="" />
              <span className="text-theme-gray text-xs font-extralight">
                {formatTime(tune.time)}
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
    images: PropTypes.shape({
      small: PropTypes.string.isRequired,
      large: PropTypes.string.isRequired,
    }).isRequired,
    time: PropTypes.string.isRequired,
  }),
};

TuneFooter.defaultProps = {
  tune: null,
};
