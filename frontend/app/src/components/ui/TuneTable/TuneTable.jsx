import { useState, useEffect, useRef } from "react";
import { TuneColumn } from "@/components/ui/TuneColumn/TuneColumn";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { PlayIcon } from "../PlayIcon/PlayIcon";
import { useAtom } from "jotai";
import { tuneAtom } from "@/atoms/tuneAtom";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPlaylist } from "@/api/playlistsIndex";
import { Skeleton } from "../Skeleton/Skeleton";

export const TuneTable = () => {
  const { communitiesId } = useParams();

  // プレイリスト楽曲を取得
  const {
    data: playlistData,
    status: playlistStatus,
    error: playlistError,
  } = useQuery({
    queryKey: ["playlist", communitiesId],
    queryFn: () => fetchPlaylist({ communitiesId: communitiesId }),
  });

  // データをそれぞれコンソールへ出力
  console.log(playlistData);
  console.log(playlistError);

  // 検索機能
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filteredPlaylist =
    (playlistData &&
      playlistData.filter(
        (tune) =>
          tune.name.toLowerCase().includes(searchText.toLowerCase()) ||
          tune.artist.toLowerCase().includes(searchText.toLowerCase()) ||
          tune.album.toLowerCase().includes(searchText.toLowerCase()),
      )) ||
    [];

  // ドロップダウンメニューの外側をクリックした場合に非表示にする
  const node = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (node.current.contains(e.target)) {
        // inside click
        return;
      }
      // outside click
      setIsSearchVisible(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [tune, setTune] = useAtom(tuneAtom);

  useEffect(() => {
    console.log("tuneAtom updated:", tune);
  }, [tune]);

  const handleColumnClick = (index, tune) => {
    setTune(tune);
  };

  return (
    <div className="flex flex-col items-end max-w-[1200px]">
      {/* テーブル操作セクション */}
      <div
        className="flex justify-between pb-16 items-center h-10 w-full"
        ref={node}
      >
        <div className="pl-5 sm:pl-11">
          <PlayIcon color="text-theme-orange" size="10" />
        </div>
        <div className="flex">
          {isSearchVisible ? (
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 bg-transparent text-theme-gray mr-5 focus:outline-none"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-theme-gray"
              />
            </div>
          ) : (
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-theme-gray mr-5"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            />
          )}
          <FontAwesomeIcon icon={faList} className="text-theme-gray" />
        </div>
      </div>
      {/* データテーブルセクション */}
      <table className="table-fixed lg:w-[1200px]">
        <thead className="sm:text-theme-gray sm:table-header sm:table-row-group hidden">
          <tr>
            <th className="text-left w-[50px] border-b border-theme-gray pl-6 hidden sm:table-cell">
              #
            </th>
            <th className="text-left sm:w-[300px] border-b border-theme-gray">
              タイトル
            </th>
            <th className="text-left w-[300px] border-b border-theme-gray pl-5 hidden lg:table-cell">
              アルバム
            </th>
            <th className="text-left w-[400px] border-b border-theme-gray pl-5 hidden sm:table-cell">
              追加日
            </th>
            <th className="text-left w-[50px] border-b border-theme-gray pl-1 hidden lg:table-cell">
              <FontAwesomeIcon
                icon={faClock}
                className="hidden sm:inline-block"
              />
            </th>
            <th className="sm:hidden"></th>
          </tr>
        </thead>
        <tbody>
          {playlistStatus === "pending" || !playlistData ? (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={index}
                  className="cursor-pointer bg-black hover:bg-theme-black text-theme-gray hover:text-white h-[56px] w-full"
                >
                  {/* 番号スケルトン */}
                  <td className="h-[56px] w-[50px] hidden sm:table-cell">
                    <Skeleton className="h-[18px] w-[18px] ml-5 hidden sm:flex" />
                  </td>
                  {/* 曲名セクションスケルトン */}
                  <td className="h-[56px] w-[300px] max-w-[300px] items-center overflow-hidden">
                    <div className="flex items-center w-full h-full ml-5 sm:ml-0">
                      <Skeleton className="h-10 w-10 rounded-sm flex-shrink-0" />
                      <div className="overflow-hidden ml-5 w-full flex-shrink">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                      </div>
                    </div>
                  </td>
                  {/* アルバムセクションスケルトン */}
                  <td className="h-[56px] w-[300px] overflow-hidden hidden lg:table-cell">
                    <Skeleton className="h-4 w-3/4 pl-5" />
                  </td>
                  {/* 追加日セクションスケルトン */}
                  <td className="hidden h-[56px] w-[300px] sm:table-cell justify-between mx-5 overflow-hidden">
                    <Skeleton className="h-4 w-1/4 pl-5" />
                  </td>
                  {/* 再生時間スケルトン */}
                  <td className="mx-5 h-[56px] w-[150px] overflow-hidden hidden lg:table-cell">
                    <Skeleton className="h-4 w-1/4" />
                  </td>
                  {/* ドットメニュースケルトン */}
                  <td className="sm:hidden">
                    <Skeleton className="h-4 w-4 justify-center px-4" />
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <>
              {filteredPlaylist.map((tune, index) => (
                <TuneColumn
                  tune={tune}
                  index={index}
                  key={index}
                  // clickedIndex={clickedIndex}
                  onClick={() => handleColumnClick(index, tune)}
                />
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};
