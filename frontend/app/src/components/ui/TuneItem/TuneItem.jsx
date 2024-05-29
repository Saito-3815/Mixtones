import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ColorIcon } from "../ColorIcon/ColorIcon";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export const TuneItem = ({ tune, index }) => {
  // 曲名・アーティストがスクロールする場合にスタイルを適用
  const tuneNameRef = useRef(null);
  const tuneArtistRef = useRef(null);

  useEffect(() => {
    const checkScroll = (element) => {
      if (element.scrollWidth > element.clientWidth) {
        element.classList.add("scroll-slide");
      }
    };

    checkScroll(tuneNameRef.current);
    checkScroll(tuneArtistRef.current);
  }, []);

  // 追加日をフォーマット
  const date = new Date(tune.added_at);
  const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

  return (
    <div className="bg-theme-black h-[56px] w-[1200px]">
      <div className="flex flex-grow flex-shrink justify-start items-center space-x-3 pr-5 col-span-3 md:col-span-1 py-3">
        {/* 番号 */}
        <span className="mr-3 text-theme-gray">{index + 1}</span>
        {/* 画像 */}
        <img
          src={`${tune.images.large}`}
          alt="images"
          className="object-cover h-10 w-10 bg-theme-gray rounded-sm ml-3"
        />
        {/* 曲名・アーティスト */}
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
        {/* アルバム */}
        <span className="text-theme-gray text-xs font-extralight">
          {tune.album}
        </span>
        {/* 追加日 */}
        {/* YYYY年M月D日で日付を表示 */}
        <span className="text-theme-gray text-xs font-extralight">
          {formattedDate}
        </span>
        {/* チェックボタン */}
        <ColorIcon icon={faCircleCheck} />
        {/* 再生時間 */}
      </div>
    </div>
  );
};

TuneItem.propTypes = {
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
