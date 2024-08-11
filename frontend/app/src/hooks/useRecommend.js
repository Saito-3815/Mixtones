import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import axios from "axios";
import { userAtom } from "@/atoms/userAtoms";
import { createRecommend } from "@/api/playlistsRecommend";
import { playlistAtom } from "@/atoms/playlistAtom";

export const useRecommend = () => {
  const [user] = useAtom(userAtom);
  const [, setCurrentPlaylist] = useAtom(playlistAtom);

  return useMutation({
    mutationFn: createRecommend,
    onSuccess: (data) => {
      if (user) {
        setCurrentPlaylist(data);
        console.log("Recommend success");
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
