import { AvatarSet } from "@/components/ui/Avatar/Avatar";
import { Button } from "@/components/ui/Button/Button";
import React, { useEffect, useRef, useState } from "react";
import { TuneTable } from "@/components/ui/TuneTable/TuneTable";
import { AlertDialogSet } from "@/components/ui/AlertDialog/AlertDialog";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCommunity } from "@/api/communitiesShow";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { useAtom } from "jotai";
import { loginUser, userAtom } from "@/atoms/userAtoms";
import axios from "axios";
import { createMemberships } from "@/api/membershipsCreate";
import { destroyMemberships } from "@/api/membershipsDestroy";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  console.log(communityData);

  if (communityError) {
    console.error(communityError);
  }

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
      // console.log(data);
    },
    onError: (error) => {
      if (axios.isCancel(error)) {
        console.log("Request was canceled by the user");
      } else {
        console.error(error);
      }
    },
  });

  const navigate = useNavigate();

  // コミュニティから脱退する
  const handleLeaveCommunity = useMutation({
    mutationFn: () => destroyMemberships(communityId),
    onSuccess: (data) => {
      switch (data.status) {
        case 200:
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
          break;
        case 202:
          // コミュニティが削除された場合、ユーザー情報を更新
          loginUser(setUser, data.data.user);
          navigate("/");
          break;
        default:
        // console.log("Unexpected status code:", data.status);
      }
      // console.log(data);
    },
    onError: (error) => {
      if (axios.isCancel(error)) {
        console.log("Request was canceled by the user");
      } else {
        console.error(error);
      }
    },
  });

  // 文字列がスクロールする場合にアニメーションを適用
  const communityNameRef = useRef(null);
  const playlistNameRef = useRef(null);
  const introductionRef = useRef(null);

  useEffect(() => {
    const checkScroll = (element) => {
      if (element && element.scrollWidth > element.clientWidth) {
        element.classList.add("scroll-slide");
      } else if (element) {
        element.classList.remove("scroll-slide");
      }
    };

    // 各要素に対して checkScroll を初回とリサイズ時に呼び出す
    checkScroll(communityNameRef.current);
    checkScroll(playlistNameRef.current);
    checkScroll(introductionRef.current);

    // リサイズイベントに対するハンドラを設定
    const handleResize = () => {
      checkScroll(communityNameRef.current);
      checkScroll(playlistNameRef.current);
      checkScroll(introductionRef.current);
    };

    window.addEventListener("resize", handleResize);

    // コンポーネントのアンマウント時にイベントリスナーを削除
    return () => window.removeEventListener("resize", handleResize);
  }, [communityData]);

  return (
    <div className="flex-col justify-center">
      {/* コミュニティセクション */}
      <div className="container mt-10 flex flex-wrap items-start justify-between mx-auto py-10 bg-theme-black max-w-[1200px] rounded-md">
        {/* 画像 */}
        <div className="flex justify-center max-w-[240px] items-start pl-5 sm:pl-3">
          <div className="flex bg-gray-400 w-60 h-60 rounded-sm items-center justify-center">
            {communityStatus === "pending" || !communityData ? (
              <Skeleton className="w-60 h-60 rounded-xl" />
            ) : communityData.avatar ? (
              <img
                src={communityData.avatar}
                alt=""
                className="object-cover object-center w-full h-full rounded-sm"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserGroup}
                className="w-3/4 h-3/4 text-gray-500 self-center"
              />
            )}
          </div>
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
          <div className="max-w-[480px] h-full flex flex-col items-start pr-40 sm:p-0 p-5">
            <h2 className="text-white text-lg whitespace-nowrap">
              コミュニティプレイリスト
            </h2>
            <h1
              className="text-white font-bold text-5xl mt-3 whitespace-nowrap"
              ref={playlistNameRef}
            >
              {communityData.playlist_name}
            </h1>
            <h2
              className="text-white mt-3 text-lg whitespace-nowrap"
              ref={communityNameRef}
            >
              {`${communityData.name}・${communityData.playlist_tunes_count}曲`}
            </h2>
            <div className="flex space-x-3 mt-1">
              {communityData.members.map((member, index) => (
                <Link key={index} to={`/users/${member.id}`}>
                  <AvatarSet src={member.avatar} size="6" />
                </Link>
              ))}
            </div>
            <p
              className="text-theme-gray text-md mt-5 whitespace-nowrap"
              ref={introductionRef}
            >
              {communityData.introduction}
            </p>
          </div>
        )}
        {/* ボタン類 */}
        <div className="max-w-[480px] pr-10 flex flex-col h-full py-10 space-y-5">
          {/* ユーザー情報にコミュニティIDが含まれていれば編集、脱退ボタン */}
          {isMember ? (
            <>
              <Link to={`/communities/${communityId}/edit`}>
                <Button
                  label="コミュニティを編集する"
                  className="bg-theme-orange w-[300px]"
                />
              </Link>
              <AlertDialogSet
                triggerComponent={
                  <Button
                    label="コミュニティから脱退する"
                    variant="secondary"
                    className="w-[300px]"
                  />
                }
                dialogTitle="このコミュニティから脱退します。よろしいですか？"
                dialogText="あなたがコミュニティメンバーの最後の一人だった場合、このコミュニティは削除されます。"
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
