import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CommunityItem } from "@/components/ui/CommunityItem/CommunityItem";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Link } from "react-router-dom";
import { fetchCommunities } from "@/api/communities";

const Top = () => {
  const { data, status, error } = useQuery({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="flex justify-center py-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-12">
        <h1 className="text-white font-bold text-xl col-span-full mt-8 ml-5">
          コミュニティ
        </h1>
        {status == "pending" ? (
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
            {data.map((community) => (
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
