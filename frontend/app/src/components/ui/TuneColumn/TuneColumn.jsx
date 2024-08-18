import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
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
import { formatTime } from "@/utils/formatTime";
import { userAtom } from "@/atoms/userAtoms";
import { CheckColorIcon } from "../ColorIcon/CheckColorIcon";
import { useCheck } from "@/hooks/useCheck";
import { useCheckDelete } from "@/hooks/useCheckDelete";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useRecommend } from "@/hooks/useRecommend";
import { useParams } from "react-router-dom";
// import { i } from "vite/dist/node/types.d-aGj9QkWt";
import { useRecommendDelete } from "@/hooks/useRecommendDelete";
import CommentModal from "../CommentModal/CommentModal";

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

  // チェック機能の実装
  // tuneのidがcheck_tunesに存在するか確認
  const [user] = useAtom(userAtom);

  const isTuneChecked =
    user &&
    Array.isArray(user.check_tunes) &&
    user.check_tunes.some(
      (tuneItem) => Number(tuneItem.id) === Number(tune.id)
    );

  const checkTune = useCheck();
  const handleCheckCreate = () => {
    if (user) {
      checkTune.mutate({ userId: user.id, spotify_uri: tune.spotify_uri });
    } else {
      alert(
        "このアイコンをクリックするとプロフィールページにお気に入りの楽曲を保存できます。この機能はログイン後にご利用いただけます"
      );
    }
  };

  const checkDelete = useCheckDelete();
  const handleCheckDelete = () => {
    if (user) {
      checkDelete.mutate({ userId: user.id, spotify_uri: tune.spotify_uri });
    } else {
      alert(
        "このアイコンをクリックするとプロフィールページにお気に入りの楽曲を保存できます。この機能はログイン後にご利用いただけます"
      );
    }
  };

  // レコメンド機能の実装
  const recommendValue = tune.recommend ? true : false;

  // urlに含まれるcommunity_idを取得
  const { communityId } = useParams();

  // 曲をレコメンドする
  const recommendTune = useRecommend(communityId);
  const handleRecommendCreate = () => {
    if (user) {
      recommendTune.mutate({ communityId: communityId, tuneId: tune.id });
    } else {
      alert(
        "このアイコンをクリックするとプレイリストの先頭へこの楽曲が優先表示されます。この機能はログイン後にご利用いただけます"
      );
    }
  };

  // 曲をレコメンド解除する
  const recommendDelete = useRecommendDelete(communityId);
  const handleRecommendDelete = () => {
    if (user) {
      recommendDelete.mutate({ communityId: communityId, tuneId: tune.id });
    } else {
      alert(
        "このアイコンをクリックするとプレイリストの先頭へこの楽曲が優先表示されます。この機能はログイン後にご利用いただけます"
      );
    }
  };

  // コメント機能の実装
  const [isModalOpen, setIsModalOpen] = useState(false);

  // spotifyのリンクをクリックした際に、外部リンクを開く
  const handleSpotifyClick = () => {
    if (tune.external_url) {
      window.open(tune.external_url, "_blank");
    }
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
          <div className="flex items-center space-x-10 px-16">
            {/* チェックボタン */}
            <CheckColorIcon
              icon={faCircleCheck}
              isTuneChecked={isTuneChecked}
              onClick={isTuneChecked ? handleCheckDelete : handleCheckCreate}
            />
            {/* レコメンドボタン */}
            <CheckColorIcon
              icon={faThumbsUp}
              isTuneChecked={recommendValue}
              onClick={
                recommendValue ? handleRecommendDelete : handleRecommendCreate
              }
            />
            {/* コメントボタン */}
            <FontAwesomeIcon
              icon={faCommentDots}
              className="h-4 w-4 cursor-pointer text-theme-white"
              onClick={() => {
                setIsModalOpen(true);
              }}
            />
            {/* コメントモーダル */}
            <CommentModal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              communityId={communityId}
              tuneId={tune.id}
            />
            {/* Spotifyリンク */}
            <FontAwesomeIcon
              icon={faSpotify}
              className="text-white h-4 w-4 cursor-pointer"
              onClick={handleSpotifyClick}
            />
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
          <DotsMenu
            isTuneChecked={isTuneChecked}
            onClickCheck={isTuneChecked ? handleCheckDelete : handleCheckCreate}
            recommendValue={recommendValue}
            onClickRecommend={
              recommendValue ? handleRecommendDelete : handleRecommendCreate
            }
          />
        </div>
      </td>
    </tr>
  );
};

TuneColumn.propTypes = {
  tune: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    album: PropTypes.string.isRequired,
    images: PropTypes.string.isRequired,
    added_at: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    spotify_uri: PropTypes.string.isRequired,
    external_url: PropTypes.string,
    recommend: PropTypes.bool,
  }),
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};
