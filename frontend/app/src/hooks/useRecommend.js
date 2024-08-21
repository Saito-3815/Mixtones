import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { createRecommend } from "@/api/playlistsRecommend";

export const useRecommend = (communityId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecommend,
    onSuccess: (data) => {
      if (data.status === 200) {
        // playlistデータを最新のデータで更新
        // queryClient.setQueryData(["playlist", communityId], data.data);
        queryClient.setQueryData(["playlist", communityId], (oldData) => {
          return {
            ...oldData,
            playlists: data.data,
          };
        });

        // const currentPlaylist = queryClient.getQueryData([
        //   "playlist",
        //   communityId,
        // ]);
        // console.log("Recommend success:", currentPlaylist);
      }
    },
    onError: (error) => {
      if (axios.isCancel(error)) {
        console.log("Request was canceled by the user");
      } else {
        console.error(error);
      }
    },
  });
};
