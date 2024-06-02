import { useState, useEffect, useRef } from "react";
import { TuneColumn } from "@/components/ui/TuneColumn/TuneColumn";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { faList, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { PlayIcon } from "../PlayIcon/PlayIcon";

export const TuneTable = ({ tunes }) => {
  // 検索機能
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filteredTunes = tunes.filter(
    (tune) =>
      tune.name.toLowerCase().includes(searchText.toLowerCase()) ||
      tune.artist.toLowerCase().includes(searchText.toLowerCase()) ||
      tune.album.toLowerCase().includes(searchText.toLowerCase()),
  );

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
          {filteredTunes.map((tune, index) => (
            <TuneColumn tune={tune} index={index} key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

TuneTable.propTypes = {
  tunes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      artist: PropTypes.string,
      album: PropTypes.string,
      images: PropTypes.string,
      added_at: PropTypes.string,
      time: PropTypes.string,
    }),
  ).isRequired,
};
