import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  faCircleCheck,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatTime } from "@/utils/formatTime";
import { useAtom } from "jotai";
import { playerAtom } from "@/atoms/playerAtom";
import { isPlayingAtom, tuneAtom } from "@/atoms/tuneAtom";
import { useCheckDelete } from "@/hooks/useCheckDelete";
import { userAtom } from "@/atoms/userAtoms";

export const TuneColumnChecked = ({ tune, index, onClick }) => {
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

  // クリック時に色を変更
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

  // チェックした楽曲の削除
  const [user] = useAtom(userAtom);

  const checkDelete = useCheckDelete();
  const handleCheckDelete = () => {
    checkDelete.mutate({ userId: user.id, spotify_uri: tune.spotify_uri });
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
            src={`${tune.images}`}
            alt="images"
            className="object-cover h-10 w-10 rounded-sm flex-shrink-0"
          />
          {/* 曲名・アーティスト */}
          <div className="overflow-hidden ml-5 w-full flex-shrink">
            <h1
              ref={tuneNameRef}
              className={`text-sm font-extralight whitespace-nowrap ${
                isSelected ? "text-theme-orange" : "text-white"
              } `}
            >{`${tune.name}`}</h1>
            <h2
              ref={tuneArtistRef}
              className="text-xs font-extralight whitespace-nowrap"
            >{`${tune.artist}`}</h2>
          </div>
        </div>
      </td>
      {/* アルバムセクション */}
      <td className="h-[56px] w-[300px] max-w-[300px] overflow-hidden hidden lg:table-cell items-center">
        <div className="flex w-full pl-5 overflow-hidden flex-shrink items-center">
          <h1
            ref={tuneAlbumRef}
            className="text-sm font-extralight whitespace-nowrap"
          >
            {tune.album}
          </h1>
        </div>
      </td>
      {/* 追加日セクション */}
      <td className="hidden h-[56px] w-[300px] sm:table-cell justify-between mx-5 overflow-hidden">
        <div className="flex items-center justify-between space-x-14 pl-5 pr-36 w-full">
          {/* 追加日 */}
          {/* YYYY年M月D日で日付を表示 */}
          <span className="hidden sm:flex text-sm font-extralight ">
            {formattedDate}
          </span>
          {/* チェックボタン */}
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-theme-orange"
            onClick={handleCheckDelete}
          />
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
    </tr>
  );
};

TuneColumnChecked.propTypes = {
  tune: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    album: PropTypes.string.isRequired,
    images: PropTypes.string.isRequired,
    added_at: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    spotify_uri: PropTypes.string.isRequired,
  }),
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};
