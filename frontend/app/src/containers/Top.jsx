import React, { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CommunityItem } from "@/components/ui/CommunityItem/CommunityItem";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Link, useNavigate } from "react-router-dom";
import { getCodeFromUrl, removeCodeVerifierAndRedirect } from "@/SpotifyAuth";
import axios from "axios";
import { useAtom } from "jotai";
import { isLoggedInAtom, loginUser, userAtom } from "@/atoms/userAtoms";

// api
import { fetchCommunities } from "@/api/communitiesIndex";
import { createUser } from "@/api/usersCreate";
import { createSessions } from "@/api/sessionsCreate";

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

  const [user, setUser] = useAtom(userAtom);

  //  ユーザー作成リクエスト
  const userCreate = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      removeCodeVerifierAndRedirect();
      if (!user) {
        loginUser(setUser, data.data.user);
      }
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

  // ユーザーログインリクエスト
  const userLogin = useMutation({
    mutationFn: createSessions,
    onSuccess: (data) => {
      removeCodeVerifierAndRedirect();
      if (!user) {
        loginUser(setUser, data.data.user);
      }
    },
    onError: (error) => {
      if (axios.isCancel(error)) {
        console.log("Request was canceled by the user");
      } else if (error.response && error.response.status === 404) {
        // :not_foundに相当するステータスコード
        navigate("/signup"); // サインアップページにリダイレクト
      } else {
        console.error(error);
      }
    },
  });

  const [isLoggedIn] = useAtom(isLoggedInAtom);

  // userAtom の変更を監視
  useEffect(() => {
    console.log("userAtom updated:", user);
    console.log("isLoggedIn?:", isLoggedIn);
  }, [user]);

  // 認証ページからリダイレクトされた際にコードを取得し、ユーザー作成もしくはログインリクエストを送信
  useEffect(() => {
    // axiosのCancelTokenを生成
    const source = axios.CancelToken.source();

    const code = getCodeFromUrl();
    // console.log(`Got code from URL: ${code}`);

    // セッションストレージからcodeVerifierを取得
    const codeVerifier = sessionStorage.getItem("codeVerifier");
    // console.log("codeVerifier:", codeVerifier);

    // URLにcodeが含まれている（認証ページからのリダイレクト時）かつcodeVerifierがセッションストレージに存在する場合のみリクエストを送信
    if (window.location.search.includes("code=") && code && codeVerifier) {
      // リダイレクト元の情報をセッションストレージから取得
      const redirectFrom = sessionStorage.getItem("redirectFrom");
      const isPersistent = sessionStorage.getItem("isPersistent");

      if (redirectFrom === "signupPage") {
        userCreate.mutate({
          code,
          codeVerifier,
          isPersistent,
          cancelToken: source.token,
        });
      } else if (redirectFrom === "loginPage") {
        userLogin.mutate({
          code,
          codeVerifier,
          isPersistent,
          cancelToken: source.token,
        });
      }
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
