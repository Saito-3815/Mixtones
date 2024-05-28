import React from "react";
import { CommunityItem } from "@/components/ui/CommunityItem/CommunityItem";

// ランダムデータ
const generateRandomData = () => {
  return {
    id: Math.floor(Math.random() * 1000),
    name: `コミュニティ${Math.floor(Math.random() * 1000)}`,
    playlistName: `プレイリスト${Math.floor(Math.random() * 1000)}`,
    introduction: `紹介文${Math.floor(Math.random() * 1000)}`,
    imgSrc: "https://picsum.photos/500",
  };
};

const Top = () => {
  const communities = Array.from({ length: 12 }, generateRandomData);

  return (
    <div className="flex justify-center py-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-12">
        <h1 className="text-white font-bold text-xl col-span-full mt-8 ml-5">
          コミュニティ
        </h1>
        {communities.map((community) => (
          <CommunityItem
            key={community.id}
            communityName={community.name}
            playlistName={community.playlistName}
            introduction={community.introduction}
            imgSrc={community.imgSrc}
          />
        ))}
      </div>
    </div>
  );
};

export default Top;
