// import { useParams } from "react
import { Button } from "@/components/ui/Button/Button";
import PropTypes from "prop-types";
import { TuneTableChecked } from "@/components/ui/TuneTableChecked/TuneTableChecked";

const User = () => {
  // const { communitiesId } = useParams();

  // プレイリスト情報
  const tunes = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Tune ${i + 1}`,
    artist: `Artist ${i + 1}`,
    album: `Album ${i + 1}`,
    images: "https://picsum.photos/500",
    added_at: "2022-01-01T00:00:00Z",
    time: "00:00",
  }));

  return (
    <div className="flex-col justify-center">
      {/* ユーザーセクション */}
      <div className="container mt-10 flex flex-wrap items-start justify-between mx-auto py-10 bg-theme-black max-w-[1200px] rounded-md">
        {/* 画像 */}
        <div className="flex justify-center max-w-[240px] items-start pl-5 sm:pl-3">
          <img
            src="https://picsum.photos/500"
            alt="User"
            className="w-40 h-40 rounded-full object-cover"
          />
        </div>
        {/* テキスト情報 */}
        <div className="max-w-[480px] h-full flex flex-col items-start pr-40 overflow-hidden sm:p-0 p-5">
          <h1 className="text-white font-bold text-5xl mt-3 whitespace-nowrap">
            ユーザー名
          </h1>
          <p className="text-theme-gray text-md mt-5 whitespace-nowrap">
            紹介文
          </p>
        </div>
        {/* ボタン類 */}
        <div className="max-w-[480px] pr-10 flex flex-col h-full py-10 space-y-5">
          <Button
            label="プロフィールを編集する"
            variant="secondary"
            className="w-[300px]"
          />
        </div>
      </div>

      {/* プレイリストセクション */}
      <div className="flex justify-center my-16">
        <TuneTableChecked tunes={tunes} />
      </div>
    </div>
  );
};

User.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default User;
