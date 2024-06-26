import { fetchPlaylist } from "@/api/playlistsIndex";
import { useQuery } from "@tanstack/react-query";

// カスタムフック
export const useCommunityPlaylist = (communityId) => {
  const { data, status, error } = useQuery({
    queryKey: ["playlist", communityId],
    queryFn: () => fetchPlaylist({ communityId }),
  });

  return { data, status, error };
};
