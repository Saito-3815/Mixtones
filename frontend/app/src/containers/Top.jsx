import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CommunityItem } from "@/components/ui/CommunityItem/CommunityItem";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import axios from "axios";
import { communitiesIndex } from "@/urls/index";

const Top = () => {
  const { data, status } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const { data } = await axios.get(communitiesIndex);

      return data;
    },
  });

  // , error, isFetching

  console.log(status);
  console.log(data);

  return (
    <div className="flex justify-center py-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-12">
        <h1 className="text-white font-bold text-xl col-span-full mt-8 ml-5">
          コミュニティ
        </h1>
        {status == "pending" ? (
          <>
            {[...Array(5)].map((_, i) => (
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
            {data.map((community) => (
              <CommunityItem
                key={community.id}
                communityName={community.name}
                playlistName={community.playlist_name}
                introduction={community.introduction}
                imgSrc={community.avatar}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Top;
