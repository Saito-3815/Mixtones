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

export const TuneColumn = ({ tune, index }) => {
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

  // クリック時に色を変更
  // ホバー時にアイコンを変更
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  // 追加日をフォーマット
  const date = new Date(tune.added_at);
  const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

  return (
    // <div
    //   className={`cursor-pointer bg-theme-black ${isClicked ? "bg-theme-black/90" : "hover:bg-theme-black/90"} text-theme-gray ${isClicked ? "text-white" : "hover:text-white"} h-[56px] lg:w-[1200px]`}
    //   onClick={handleClick}
    //   onMouseEnter={handleMouseEnter}
    //   onMouseLeave={handleMouseLeave}
    // >
    //   <tr className={`flex justify-start items-center h-full w-full `}>
    <tr
      className={`cursor-pointer bg-theme-black ${isClicked ? "bg-theme-black/90" : "hover:bg-theme-black/90"} text-theme-gray ${isClicked ? "text-white" : "hover:text-white"} h-[56px] lg:w-[1200px] flex justify-start items-center`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 番号 */}
      <td>
        <div
          className={`w-[18px] h-[18px] items-center justify-center ml-5 hidden sm:inline-block hover:text-white ${isClicked ? "text-theme-orange" : "text-theme-gray"}`}
        >
          {isHovered && !isClicked ? (
            <FontAwesomeIcon
              icon={faPlay}
              style={{ width: "100%", height: "100%" }}
            />
          ) : isHovered && isClicked ? (
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
      <td className="flex justify-start items-center">
        {/* 画像 */}
        <img
          src={`${tune.images}`}
          alt="images"
          className="object-cover h-10 w-10 rounded-sm ml-5"
        />
        {/* 曲名・アーティスト */}
        <div className="w-[300px] overflow-hidden ml-5">
          <h1
            ref={tuneNameRef}
            className={`text-sm font-extralight whitespace-nowrap overflow-x-visible ${
              isClicked ? "text-theme-orange" : "text-white"
            } `}
          >{`${tune.name}`}</h1>
          <h2
            ref={tuneArtistRef}
            className="text-xs font-extralight whitespace-nowrap overflow-x-visible"
          >{`${tune.artist}`}</h2>
        </div>
      </td>
      {/* アルバムセクション */}
      <td>
        <div className="w-[300px] overflow-hidden ml-5">
          <h1
            ref={tuneAlbumRef}
            className="text-sm font-extralight hidden sm:flex whitespace-nowrap overflow-x-visible"
          >
            {tune.album}
          </h1>
        </div>
      </td>
      {/* 追加日セクション */}
      <td className="hidden sm:flex items-center justify-between w-[330px] mx-5">
        {/* 追加日 */}
        {/* YYYY年M月D日で日付を表示 */}
        <span className="hidden lg:flex text-sm font-extralight">
          {formattedDate}
        </span>
        {/* チェックボタン */}
        <ColorIcon icon={faCircleCheck} />
        {/* レコメンドボタン */}
        <ColorIcon icon={faThumbsUp} />
        {/* コメントボタン */}
        <ColorIcon icon={faCommentDots} />
      </td>
      {/* 再生時間 */}
      <td className="mx-5">
        <span className="text-sm font-extralight">{tune.time}</span>
      </td>
      <div className="md:hidden mr-5">
        <DotsMenu />
      </div>
    </tr>
    // </div>
  );
};

TuneColumn.propTypes = {
  tune: PropTypes.shape({
    name: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    album: PropTypes.string.isRequired,
    images: PropTypes.shape({
      small: PropTypes.string.isRequired,
      large: PropTypes.string.isRequired,
    }).isRequired,
    added_at: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }),
  index: PropTypes.number.isRequired,
};
