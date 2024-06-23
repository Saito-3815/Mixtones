import { AvatarSet } from "@/components/ui/Avatar/Avatar";
import { Button } from "@/components/ui/Button/Button";
import React, { useEffect, useState } from "react";
import { TuneTable } from "@/components/ui/TuneTable/TuneTable";
import { AlertDialogSet } from "@/components/ui/AlertDialog/AlertDialog";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCommunity } from "@/api/communitiesShow";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { useAtom } from "jotai";
import { loginUser, userAtom } from "@/atoms/userAtoms";
import axios from "axios";
import { createMemberships } from "@/api/membershipsCreate";
import { destroyMemberships } from "@/api/membershipsDestroy";

const Community = () => {
  const { communityId } = useParams();
  // console.log("communityId:", communityId);

  const [user, setUser] = useAtom(userAtom);

  const queryClient = useQueryClient();

  // user が null または undefined でない、かつ communities プロパティを持っていることを確認
  // さらに、community が null または undefined でないことも確認
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const checkIsMember =
      user &&
      user.communities &&
      communityId &&
      user.communities.some(
        (community) => community && community.id.toString() === communityId,
      );
    setIsMember(checkIsMember);
  }, [user, communityId]);

  // コミュニティ情報を取得
  const {
    data: communityData,
    status: communityStatus,
    error: communityError,
  } = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => fetchCommunity({ communityId: communityId }),
  });

  //データをそれぞれコンソールへ出力
  // console.log(communityData);
  console.log(communityError);

  // コミュニティに参加する
  const handleJoinCommunity = useMutation({
    mutationFn: () =>
      createMemberships({ communityId: communityId, userId: user.id }),
    onSuccess: (data) => {
      if (data.status === 201) {
        loginUser(setUser, data.data.user);
        // communityDataを最新のデータで更新
        queryClient.setQueryData(
          ["community", communityId],
          data.data.community,
        );
        // playlistデータを最新のデータで更新
        queryClient.setQueryData(
          ["playlist", communityId],
          data.data.community.playlist_tunes,
        );
      }
      console.log(data);
    },
    onError: (error) => {
      if (axios.isCancel(error)) {
        console.log("Request was canceled by the user");
      } else {
        console.error(error);
      }
    },
  });

  // コミュニティから脱退する
  // コミュニティから脱退する
  const handleLeaveCommunity = useMutation({
    mutationFn: () => destroyMemberships(user.id, communityId),
    onSuccess: (data) => {
      if (data.status === 200) {
        loginUser(setUser, data.data.user);
        // communityDataを最新のデータで更新
        queryClient.setQueryData(
          ["community", communityId],
          data.data.community,
        );
        // playlistデータを最新のデータで更新
        queryClient.setQueryData(
          ["playlist", communityId],
          data.data.community.playlist_tunes,
        );
      }
      console.log(data);
    },
    onError: (error) => {
      if (axios.isCancel(error)) {
        console.log("Request was canceled by the user");
      } else {
        console.error(error);
      }
    },
  });

  return (
    <div className="flex-col justify-center">
      {/* コミュニティセクション */}
      <div className="container mt-10 flex flex-wrap items-start justify-between mx-auto py-10 bg-theme-black max-w-[1200px] rounded-md">
        {/* 画像 */}
        <div className="flex justify-center max-w-[240px] items-start pl-5 sm:pl-3">
          {communityStatus === "pending" || !communityData ? (
            <Skeleton className="w-60 h-60 sm:w-40 sm:h-40 rounded-xl" />
          ) : (
            <img
              src={communityData.avatar}
              alt="community"
              className="w-40 h-40 rounded-sm object-cover"
            />
          )}
        </div>
        {/* テキスト情報 */}
        {communityStatus === "pending" || !communityData ? (
          <div className="max-w-[480px] h-full flex flex-col items-start pr-40 overflow-hidden sm:p-0 p-5">
            <Skeleton className="h-6 w-[160px]" />
            <Skeleton className="h-20 w-[360px] mt-3" />
            <Skeleton className="h-6 w-[160px] mt-3" />
            <div className="flex space-x-3 mt-1">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <Skeleton className="h-5 w-[160px] mt-5" />
          </div>
        ) : (
          <div className="max-w-[480px] h-full flex flex-col items-start pr-40 overflow-hidden sm:p-0 p-5">
            <h2 className="text-white text-lg whitespace-nowrap">
              コミュニティプレイリスト
            </h2>
            <h1 className="text-white font-bold text-5xl mt-3 whitespace-nowrap">
              {communityData.playlist_name}
            </h1>
            <h2 className="text-white mt-3 text-lg whitespace-nowrap">
              {`${communityData.name}・曲数`}
            </h2>
            <div className="flex space-x-3 mt-1">
              {communityData.members.map((member, index) => (
                <AvatarSet key={index} src={member.avatar} size="6" />
              ))}
            </div>
            <p className="text-theme-gray text-md mt-5 whitespace-nowrap">
              {communityData.introduction}
            </p>
          </div>
        )}
        {/* ボタン類 */}
        <div className="max-w-[480px] pr-10 flex flex-col h-full py-10 space-y-5">
          {/* ユーザー情報にコミュニティIDが含まれていれば編集、脱退ボタン */}
          {isMember ? (
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
                onActionClick={handleLeaveCommunity.mutate}
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
              onActionClick={handleJoinCommunity.mutate}
              cancelText="キャンセル"
            />
          )}
        </div>
      </div>

      {/* プレイリストセクション */}
      <div className="flex justify-center my-16">
        <TuneTable />
      </div>
    </div>
  );
};

export default Community;
