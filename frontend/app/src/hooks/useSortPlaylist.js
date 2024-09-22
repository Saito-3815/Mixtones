import { playlistAtom } from "@/atoms/playlistAtom";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";

const useSortPlaylist = (playlistData) => {
  const [sortKey, setSortKey] = useState(null); // 初期値はnull
  const [sortOrder, setSortOrder] = useState(null); // 初期値はnull
  const [sortedPlaylist, setSortedPlaylist] = useState(playlistData); // 初期値は元のplaylistData
  const [, setCurrentPlaylist] = useAtom(playlistAtom);

  useEffect(() => {
    if (sortOrder === 'default') {
      setSortedPlaylist(playlistData); // sortOrderがdefaultの場合は元の並び
    } else if (sortKey && sortOrder) {
      const sorted = [...playlistData].sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortKey] > b[sortKey] ? 1 : -1;
        } else if (sortOrder === "desc") {
          return a[sortKey] < b[sortKey] ? 1 : -1;
        }
      });
      setSortedPlaylist(sorted);
    } else {
      setSortedPlaylist(playlistData); // ソートキーとソート順が設定されていない場合は元の並び
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