import { useState, useEffect, useRef } from "react";

const useSearchPlaylist = (playlistData) => {
  // const [currentPlaylist, setCurrentPlaylist] = useAtom(playlistAtom);
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const node = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (node.current && !node.current.contains(e.target)) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // playlistDataがundefinedまたはnullでないことを確認し、配列であることを保証します。
  const safePlaylistData = Array.isArray(playlistData) ? playlistData : [];

  const filteredPlaylist = safePlaylistData.filter(
    (tune) =>
      tune.name.toLowerCase().includes(searchText.toLowerCase()) ||
      tune.artist.toLowerCase().includes(searchText.toLowerCase()) ||
      tune.album.toLowerCase().includes(searchText.toLowerCase()),
  );

  return {
    searchText,
    setSearchText,
    isSearchVisible,
    setIsSearchVisible,
    filteredPlaylist,
    node,
  };
};

export default useSearchPlaylist;
