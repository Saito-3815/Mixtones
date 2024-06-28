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
import { playerAtom } from "@/atoms/playerAtom";
import { playlistAtom } from "@/atoms/playlistAtom";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import { usePlay } from "@/hooks/usePlay";

export const TuneFooter = () => {
  const [tune, setTune] = useAtom(tuneAtom);
  const [isPlaying] = useAtom(isPlayingAtom);
  const [player] = useAtom(playerAtom);
  const [playlistData, setPlaylistData] = useAtom(playlistAtom);

  const [deviceId, setDeviceId] = useState(null);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState(false);

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
    return { index: tune.index, tune: playlistData[nextIndex] };
  };

  // 前のトラックを取得
  const prevTrack = () => {
    let prevIndex = tune.index - 1; // tune.indexを減らす前に前のインデックスを計算
    if (prevIndex < 0) {
      // 0未満になるかチェック
      prevIndex = playlistData.length - 1; // 0未満になる場合は最後に戻る
    }
    tune.index = prevIndex; // tune.indexを更新
    return { index: tune.index, tune: playlistData[prevIndex] };
  };

  // プレイリストデータのコピーを保持
  const [originalPlaylistData, setOriginalPlaylistData] = useState([]);

  const isInitialMount = useRef(true); // 初回マウント時にtrueに設定

  useEffect(() => {
    if (playlistData.length > 0 && isInitialMount.current) {
      setOriginalPlaylistData([...playlistData]);
      isInitialMount.current = false; // 初回マウント後はフラグをfalseに設定
    }
  }, [playlistData]);

  useEffect(() => {
    console.log("originalPlaylistData:", originalPlaylistData);
  }, [originalPlaylistData]);

  // shuffleModeがtrueに切り替わったらplaylistDataをシャッフル
  useEffect(() => {
    if (shuffleMode) {
      const shuffledPlaylistData = [...playlistData].sort(
        () => Math.random() - 0.5,
      );
      setPlaylistData(shuffledPlaylistData);
      console.log("shuffledPlaylistData", shuffledPlaylistData);
    } else if (originalPlaylistData.length > 0) {
      // シャッフルモードがfalseになったら、保存しておいた元のplaylistDataを復元
      setPlaylistData(originalPlaylistData);
    }
  }, [shuffleMode]);

  // repeateModeがtrueに切り替わったらplaylistDataの全ての要素を現在のtuneデータのコピーで置き換え
  useEffect(() => {
    if (repeatMode) {
      const repeatPlaylistData = Array(playlistData.length).fill(tune.tune);
      setPlaylistData(repeatPlaylistData);
      console.log("repeatPlaylistData", repeatPlaylistData);
    } else if (originalPlaylistData.length > 0) {
      // リピートモードがfalseになったら、保存しておいた元のplaylistDataを復元
      setPlaylistData(originalPlaylistData);
    }
  }, [repeatMode]);

  // プレイリストデータからSpotify URIを取得
  const spotifyUris = playlistData.map((track) => track.spotify_uri);

  // Spotifyプレイヤーの初期化
  useSpotifyPlayer(setDeviceId);

  // playlistDataの曲を再生
  const play = usePlay(deviceId);

  useEffect(() => {
    console.log("IsPlayingAtom is now", isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    console.log("shuffleMode", shuffleMode);
  }, [shuffleMode]);

  useEffect(() => {
    console.log("repeatMode", repeatMode);
  }, [repeatMode]);

  // tuneが変更されたときに音楽を再生する
  useEffect(() => {
    if (tune && tune.tune.spotify_uri && player && deviceId) {
      console.log(`Attempting to play tune on device with ID: ${deviceId}`);
      play(spotifyUris, tune.index);
    } else {
      console.log(`Unable to play tune. Device ID: ${deviceId}`);
    }
  }, [tune, player, deviceId, shuffleMode, repeatMode]);

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
                mode={shuffleMode}
                onClick={() => {
                  if (repeatMode) {
                    setRepeatMode(false);
                  }
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
              <ColorIcon
                icon={faRepeat}
                mode={repeatMode}
                onClick={() => {
                  if (shuffleMode) {
                    setShuffleMode(false);
                  }
                  setRepeatMode(!repeatMode);
                }}
              />
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
