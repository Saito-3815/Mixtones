import React, { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CommunityItem } from "@/components/ui/CommunityItem/CommunityItem";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Link } from "react-router-dom";
import { fetchCommunities } from "@/api/communities";
import { getCodeFromUrl } from "@/SpotifyAuth";
import axios from "axios";
import { usersCreate } from "@/urls/index";

const Top = () => {
  // コミュニティー一覧を取得
  const {
    data: communitiesData,
    status: communitiesStatus,
    error: communitiesError,
  } = useQuery({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (communitiesError) {
    return <div>Error</div>;
  }

  //  ユーザー作成リクエスト関数
  const userCreate = useMutation({
    mutationFn: ({ code, codeVerifier, cancelToken }) => {
      const encodedCode = btoa(code);
      return axios.post(
        usersCreate,
        { user: { code: encodedCode, code_verifier: codeVerifier } },
        { cancelToken },
      );
    },
    onSuccess: (data) => {
      console.log("User data:", data);
    },
    onError: (error) => {
      if (axios.isCancel(error)) {
        console.log("Request was canceled by the user");
      } else {
        console.error(error);
      }
    },
  });

  // 認証ページからリダイレクトされた際にコードを取得し、ユーザー作成リクエストを送信
  useEffect(() => {
    // axiosのCancelTokenを生成
    const source = axios.CancelToken.source();

    const code = getCodeFromUrl();
    console.log(`Got code from URL: ${code}`);

    // セッションストレージからcodeVerifierを取得
    const codeVerifier = sessionStorage.getItem("codeVerifier");
    console.log("codeVerifier:", codeVerifier);

    // getAccessToken(code, codeVerifier)
    // .then(token => {
    //   console.log(`Got token from URL: ${token}`);
    // })
    // .catch(error => {
    //   console.error('Failed to get access token:', error);
    // });

    if (code && codeVerifier) {
      userCreate.mutate({ code, codeVerifier, cancelToken: source.token });
    }

    // クリーンアップ関数でリクエストをキャンセル
    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, []);

  return (
    <div className="flex justify-center py-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-12">
        <h1 className="text-white font-bold text-xl col-span-full mt-8 ml-5">
          コミュニティ
        </h1>
        {communitiesStatus == "pending" ? (
          <>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col space-y-3 w-[280px] h-[340px] sm:w-[200px] sm:h-[260px]"
              >
                <Skeleton className="w-60 h-60 sm:w-40 sm:h-40 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[160px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {communitiesData.map((community) => (
              <Link to={`/communities/${community.id}`} key={community.id}>
                <CommunityItem
                  communityName={community.name}
                  playlistName={community.playlist_name}
                  introduction={community.introduction}
                  imgSrc={community.avatar}
                />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Top;
