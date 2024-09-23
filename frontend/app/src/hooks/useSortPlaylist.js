import { playlistAtom } from "@/atoms/playlistAtom";
import { userAtom } from "@/atoms/userAtoms";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";

const useSortPlaylist = (playlistData) => {
  const [sortKey, setSortKey] = useState(null); // 初期値はnull
  const [sortOrder, setSortOrder] = useState(null); // 初期値はnull
  const [sortedPlaylist, setSortedPlaylist] = useState(playlistData); // 初期値は元のplaylistData
  const [currentPlaylist, setCurrentPlaylist] = useAtom(playlistAtom);
  const [user] = useAtom(userAtom);

  useEffect(() => {
    switch (sortOrder) {
      case "default":
        setSortedPlaylist(playlistData); // sortOrderがdefaultの場合は元の並び
        break;
      case "memberLikes": {
        const likedTuneIds = user.like_tunes.map((tune) => tune.id);
        const filtered = playlistData.filter(
          (tune) => !likedTuneIds.includes(tune.id)
        );
        setSortedPlaylist(filtered);
        break;
      }
      case 'showComments': {
        const commentTuneIds = currentPlaylist.comments_id.map(comment => comment.tune_id);
        const filtered = playlistData.filter(tune => commentTuneIds.includes(tune.id));
        setSortedPlaylist(filtered);
        break;
      }
      case "asc":
      case "desc":
        if (sortKey) {
          const sorted = [...playlistData].sort((a, b) => {
            if (sortOrder === "asc") {
              return a[sortKey] > b[sortKey] ? 1 : -1;
            } else if (sortOrder === "desc") {
              return a[sortKey] < b[sortKey] ? 1 : -1;
            }
          });
          setSortedPlaylist(sorted);
        }
        break;
      default:
        setSortedPlaylist(playlistData); // ソートキーとソート順が設定されていない場合は元の並び
        break;
    }

    setCurrentPlaylist((prev) => ({
      ...prev,
      playlists: sortedPlaylist,
    }));
  }, [sortKey, sortOrder, playlistData]);

  return {
    sortedPlaylist,
    setSortKey,
    setSortOrder,
  };
};

export default useSortPlaylist;
