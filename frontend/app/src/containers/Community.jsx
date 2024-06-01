import { AvatarSet } from "@/components/ui/Avatar/Avatar";
import { Button } from "@/components/ui/Button/Button";
import React from "react";
import PropTypes from "prop-types";
import { TuneTable } from "@/components/ui/TuneTable/TuneTable";
import { AlertDialogSet } from "@/components/ui/AlertDialog/AlertDialog";
import { useParams } from "react-router-dom";

const Community = ({ user }) => {
  const { communitiesId } = useParams();

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
      {/* コミュニティセクション */}
      <div className="container mt-10 flex flex-wrap items-start justify-between mx-auto py-10 bg-theme-black max-w-[1200px] rounded-md">
        {/* 画像 */}
        <div className="flex justify-center max-w-[240px] items-start pl-5 sm:pl-3">
          <img
            src="https://picsum.photos/500"
            alt="community"
            className="w-40 h-40 rounded-sm object-cover"
          />
        </div>
        {/* テキスト情報 */}
        <div className="max-w-[480px] h-full flex flex-col items-start pr-40 overflow-hidden sm:p-0 p-5">
          <h2 className="text-white text-lg whitespace-nowrap">
            コミュニティプレイリスト
          </h2>
          <h1 className="text-white font-bold text-5xl mt-3 whitespace-nowrap">
            {`コミュニティ${communitiesId}のプレイリスト`}
          </h1>
          <h2 className="text-white mt-3 text-lg whitespace-nowrap">
            {`コミュニティ${communitiesId}・曲数`}
          </h2>
          <div className="flex space-x-3 mt-1">
            <AvatarSet src="https://picsum.photos/500" size="6" />
            <AvatarSet src="" size="6" />
            <AvatarSet src="" size="6" />
            <AvatarSet src="https://picsum.photos/500" size="6" />
          </div>
          <p className="text-theme-gray text-md mt-5 whitespace-nowrap">
            紹介文
          </p>
        </div>
        {/* ボタン類 */}
        <div className="max-w-[480px] pr-10 flex flex-col h-full py-10 space-y-5">
          {/* ユーザーがログインしていれば編集、脱退ボタン */}
          {user ? (
            <>
              <Button
                label="コミュニティを編集する"
                className="bg-theme-orange w-[300px]"
              />
              <AlertDialogSet
                triggerComponent={
                  <Button
                    label="コミュニティから脱退する"
                    variant="secondary"
                    className="w-[300px]"
                  />
                }
                dialogTitle="このコミュニティから脱退します。よろしいですか？"
                dialogText="脱退すると、コミュニティプレイリスト内であなたの「お気に入りの曲」が更新がされなくなります。"
                actionText="コミュニティから脱退する"
                cancelText="キャンセル"
              />
            </>
          ) : (
            <AlertDialogSet
              triggerComponent={
                <Button
                  label="コミュニティに参加する"
                  variant="secondary"
                  className="w-[300px]"
                />
              }
              dialogTitle="このコミュニティに参加します。よろしいですか？"
              dialogText="参加すると、コミュニティプレイリスト内にあなたの「お気に入りの曲」が更新が共有されます。"
              actionText="コミュニティに参加する"
              cancelText="キャンセル"
            />
          )}
        </div>
      </div>

      {/* プレイリストセクション */}
      <div className="flex justify-center my-16">
        <TuneTable tunes={tunes} />
      </div>
    </div>
  );
};

Community.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default Community;
