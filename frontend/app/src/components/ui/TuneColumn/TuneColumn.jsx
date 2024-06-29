import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ColorIcon } from "../ColorIcon/ColorIcon";
import {
  faCircleCheck,
  faCommentDots,
  faPause,
  faPlay,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { DotsMenu } from "../DotsMenu/DotsMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isPlayingAtom, tuneAtom } from "@/atoms/tuneAtom";
import { useAtom } from "jotai";
import { playerAtom } from "@/atoms/playerAtom";

export const TuneColumn = ({ tune, index, onClick }) => {
  if (!tune) {
    return null;
  }

  // 曲名・アーティストがスクロールする場合にスタイルを適用
  const tuneNameRef = useRef(null);
  const tuneArtistRef = useRef(null);
  const tuneAlbumRef = useRef(null);

  useEffect(() => {
    const checkScroll = (element) => {
      if (element.scrollWidth > element.clientWidth) {
        element.classList.add("scroll-slide");
      }
    };

    checkScroll(tuneNameRef.current);
    checkScroll(tuneArtistRef.current);
    checkScroll(tuneAlbumRef.current);
  }, []);

  // spotifyのプレイヤー情報を取得
  const [player] = useAtom(playerAtom);

  // 現在選択されているtuneを取得
  const [currentTune] = useAtom(tuneAtom);

  // 再生中かどうかを判断
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);

  // ホバー時にアイコンを変更
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // tuneが現在選択されているかどうかを判断する際に、currentTuneまたはcurrentTune.tuneがundefinedでないことを確認
  const isSelected =
    currentTune && currentTune.tune && currentTune.tune.id === Number(tune.id)
      ? true
      : false;

  const handleClick = () => {
    // 現在のtuneが既に選択されているか確認し、選択されていれば再生状態のみを切り替える
    if (
      currentTune &&
      currentTune.tune &&
      currentTune.tune.id === Number(tune.id)
    ) {
      player.togglePlay();
      setIsPlaying(!isPlaying);
      return;
    }

    // 初めてこのtuneがクリックされた場合、onClickを呼び出してtuneAtomを更新し、再生状態を切り替える
    if (onClick) {
      onClick(); // TuneTableから渡されたonClick(tuneAtomを更新する関数)
      player.togglePlay();
      setIsPlaying(!isPlaying);
    }
  };

  // 追加日をフォーマット
  const date = new Date(tune.added_at);
  const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

  // 再生時間をフォーマット（ミリ秒対応）
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <tr
      className={`cursor-pointer bg-black ${isSelected ? "bg-theme-black" : "hover:bg-theme-black"} text-theme-gray ${isSelected ? "text-white" : "hover:text-white"} h-[56px] w-full`}
    >
      {/* 番号 */}
      <td className="h-[56px] w-[50px] hidden sm:table-cell">
        <div
          className={`w-[18px] h-[18px] items-center justify-center ml-5 hidden sm:flex hover:text-white ${isSelected ? "text-theme-orange" : "text-theme-gray"}`}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isHovered && !isSelected ? (
            <FontAwesomeIcon
              icon={faPlay}
              style={{ width: "100%", height: "100%" }}
            />
          ) : isHovered && isSelected && !isPlaying ? (
            <FontAwesomeIcon
              icon={faPlay}
              style={{ width: "100%", height: "100%" }}
            />
          ) : isHovered && isSelected && isPlaying ? (
            <FontAwesomeIcon
              icon={faPause}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <span
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {index + 1}
            </span>
          )}
        </div>
      </td>
      {/* 曲名セクション */}
      <td className="h-[56px] w-[300px] max-w-[300px] items-center overflow-hidden">
        <div
          className="flex items-center w-full h-full ml-5 sm:ml-0"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* 画像 */}
          <img
            src={tune.images}
            alt="images"
            className="object-cover h-10 w-10 rounded-sm flex-shrink-0"
          />
          {/* 曲名・アーティスト */}
          <div className="overflow-hidden ml-5 w-full flex-shrink">
            <h1
              ref={tuneNameRef}
              className={`text-sm font-extralight whitespace-nowrap overflow-x-hidden ${
                isSelected ? "text-theme-orange" : "text-white"
              } `}
            >{`${tune.name}`}</h1>
            <h2
              ref={tuneArtistRef}
              className="text-xs font-extralight whitespace-nowrap overflow-x-hidden"
            >{`${tune.artist}`}</h2>
          </div>
        </div>
      </td>
      {/* アルバムセクション */}
      <td className="h-[56px] w-[300px] overflow-hidden hidden lg:table-cell">
        <div className="flex items-center w-full whitespace-nowrap pl-5">
          <h1
            ref={tuneAlbumRef}
            className="text-sm font-extralight overflow-hidden"
          >
            {tune.album}
          </h1>
        </div>
      </td>
      {/* 追加日セクション */}
      <td className="hidden h-[56px] w-[300px] sm:table-cell justify-between mx-5 overflow-hidden">
        <div className="flex items-center justify-between pl-5 w-full">
          {/* 追加日 */}
          {/* YYYY年M月D日で日付を表示 */}
          <span className="hidden sm:flex text-sm font-extralight ">
            {formattedDate}
          </span>
          <div className="flex items-center space-x-14 pr-16">
            {/* チェックボタン */}
            <ColorIcon icon={faCircleCheck} />
            {/* レコメンドボタン */}
            <ColorIcon icon={faThumbsUp} />
            {/* コメントボタン */}
            <ColorIcon icon={faCommentDots} />
          </div>
        </div>
      </td>
      {/* 再生時間 */}
      <td className="mx-5 h-[56px] w-[150px] overflow-hidden hidden lg:table-cell">
        <div className="flex items-center">
          <span className="text-sm font-extralight">
            {formatTime(tune.time)}
          </span>
        </div>
      </td>
      {/* ドットメニュー */}
      <td className="sm:hidden">
        <div className="md:hidden justify-center px-4">
          <DotsMenu />
        </div>
      </td>
    </tr>
  );
};

TuneColumn.propTypes = {
  tune: {
    tune: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      album: PropTypes.string.isRequired,
      images: PropTypes.string.isRequired,
      added_at: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    }),
    index: PropTypes.number.isRequired,
  },
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};
