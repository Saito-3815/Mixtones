import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CommunityItem } from "@/components/ui/CommunityItem/CommunityItem";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Link } from "react-router-dom";
import { fetchCommunities } from "@/api/communities";
import { getCodeFromUrl } from "@/SpotifyAuth";
import axios from "axios";
import { usersCreate } from "@/urls";

const Top = () => {
  // コミュニティー一覧を取得
  const {
    data: communitiesData,
    status: communitiesStatus,
    error: communitiesError,
  } = useQuery({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (communitiesError) {
    return <div>Error</div>;
  }

  // ユーザー情報をバックエンドに送信
  const { data: userData, error: userError } = useQuery({
    queryKey: "user",
    queryFn: async () => {
      const code = getCodeFromUrl();
      console.log(`Got code from URL: ${code}`);

      // codeが存在する場合のみバックエンドにフェッチ
      if (code) {
        // codeをBase64でエンコード
        const encodedCode = btoa(code);

        // バックエンドにcodeを送信
        const { data } = await axios.post(usersCreate, { code: encodedCode });
        return data;
      }
    },
  });

  if (userData) {
    console.log("User data:", userData);
  }

  if (userError) {
    return <div>Error</div>;
  }

  return (
    <div className="flex justify-center py-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-12">
        <h1 className="text-white font-bold text-xl col-span-full mt-8 ml-5">
          コミュニティ
        </h1>
        {communitiesStatus == "pending" ? (
          <>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col space-y-3 w-[280px] h-[340px] sm:w-[200px] sm:h-[260px]"
              >
                <Skeleton className="w-60 h-60 sm:w-40 sm:h-40 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[160px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {communitiesData.map((community) => (
              <Link to={`/communities/${community.id}`} key={community.id}>
                <CommunityItem
                  communityName={community.name}
                  playlistName={community.playlist_name}
                  introduction={community.introduction}
                  imgSrc={community.avatar}
                />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Top;
