import { AvatarSet } from "@/components/ui/Avatar/Avatar";
import { Button } from "@/components/ui/Button/Button";
import React from "react";
// import { useParams } from "react-router-dom";

const Community = () => {
  // const { communitiesId } = useParams();

  return (
    <div className="container mt-20 flex flex-wrap items-start justify-between mx-auto py-10 bg-theme-black max-w-[1200px] rounded-md">
      {/* 画像 */}
      <div className="flex justify-center max-w-[240px] items-start pl-3">
        <img
          src="https://picsum.photos/500"
          alt="community"
          className="w-40 h-40"
        />
      </div>
      {/* テキスト情報 */}
      <div className="max-w-[480px] h-full flex flex-col items-start pr-40 overflow-hidden sm:p-0 p-5">
        <h2 className="text-white text-lg whitespace-nowrap">
          コミュニティプレイリスト
        </h2>
        <h1 className="text-white font-bold text-5xl mt-3 whitespace-nowrap">
          プレイリスト名
        </h1>
        <h2 className="text-white mt-3 text-lg whitespace-nowrap">
          コミュニティ名・曲数
        </h2>
        <div className="flex space-x-3 mt-1">
          <AvatarSet src="https://picsum.photos/500" size="6" />
          <AvatarSet src="" size="6" />
          <AvatarSet src="" size="6" />
          <AvatarSet src="https://picsum.photos/500" size="6" />
        </div>
        <p className="text-theme-gray text-md mt-5 whitespace-nowrap">紹介文</p>
      </div>
      {/* ボタン類 */}
      <div className="max-w-[480px] pr-10 flex flex-col h-full py-10 space-y-5">
        <Button
          label="コミュニティを編集する"
          className="bg-theme-orange w-[300px]"
        />
        <Button
          label="コミュニティから脱退する"
          variant="secondary"
          className="w-[300px]"
        />
      </div>
    </div>
  );
};

export default Community;
