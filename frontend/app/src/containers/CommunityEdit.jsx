import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
// import { Switch } from "@/components/ui/Switch/Switch";
import { Button } from "@/components/ui/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCommunity } from "@/api/communitiesShow";
import { updateCommunities } from "@/api/communitiesUpdate";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";
import { useRef } from "react";
import { useGetSignedUrl } from "@/hooks/useGetSignedUrl";
import { useUploadS3 } from "@/hooks/useUploadS3";
import { useUpdateCommunitiesAvatar } from "@/hooks/useUpdateCommunitiesAvatar";

const CommunityEdit = () => {
  const { communityId } = useParams();

  const navigate = useNavigate();

  const [user] = useAtom(userAtom);

  const inputRef = useRef(null);

  // コミュニティ情報を取得
  const {
    data: communityData,
    // status: communityStatus,
    error: communityError,
  } = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => fetchCommunity({ communityId: communityId }),
  });

  if (communityError) {
    console.error(communityError);
  }

  // ユーザーがコミュニティのメンバーかどうかを確認
  const [isMember, setIsMember] = useState(true);

  useEffect(() => {
    if (user && user.communities && communityId) {
      const checkIsMember = user.communities.some(
        (community) => community && community.id.toString() === communityId,
      );
      setIsMember(checkIsMember);
    }
  }, [user, communityId]);

  // メンバーでない場合はエラーを表示してリダイレクト
  useEffect(() => {
    // user, communityIdが存在し、かつisMemberの状態が確定している場合にのみチェックを行う
    if (user && communityId && isMember === false) {
      alert("エラー: このコミュニティのメンバーではありません。");
      navigate(`/communities/${communityId}`);
    }
  }, [isMember, user, communityId]);

  const community = {
    communityName: communityData ? communityData.name : "",
    playlistName: communityData ? communityData.playlist_name : "",
    introduction: communityData ? communityData.introduction : "",
    communityImage: communityData ? communityData.avatar : "",
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    setValue("image", community.communityImage);
    setValue("communityName", community.communityName);
    setValue("playlistName", community.playlistName);
    setValue("introduction", community.introduction);
  }, [communityData]);

  const onSubmit = (data) => {
    const dataWithId = { ...data, communityId };
    CommunityEdit.mutate(dataWithId);
  };

  // コミュニティのテキスト情報を更新
  const CommunityEdit = useMutation({
    mutationFn: (dataWithId) => {
      const { communityId, ...data } = dataWithId;
      return updateCommunities(data, communityId);
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        console.log(data);
        navigate(`/communities/${communityId}`);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // 画像をアップロードして更新する
  const [, setImage] = useState(null);

  const ImageSubmit = async (e) => {
    console.log(e.target.files);
    const file = e.target.files[0];
    setImage(file);

    // バックエンドから署名付きURLを取得
    try {
      // mutateAsyncで結果をPromiseを使用してawaitで待つ
      const response = await getSignedUrl.mutateAsync(file);

      const url = response.data.url;
      if (!url) {
        throw new Error("URLがresponseに含まれていません。");
      }

      const fileKey = extractFileKeyFromUrl(url);
      console.log("ファイルのkey:", fileKey);

      // S3へファイルをアップロード
      const uploadResponse = await uploadS3.mutateAsync({ file, url });

      // アップロードが成功した場合、バックエンドにfileKeyを送信
      if (uploadResponse && uploadResponse.status === 200) {
        await updateAvatar.mutate({ fileKey, communityId });
      } else {
        // uploadResponseが期待通りでない場合のエラーハンドリング
        console.error("アップロードに失敗しました。", uploadResponse);
        throw new Error("アップロードに失敗しました。");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 署名付きURLを取得
  const getSignedUrl = useGetSignedUrl();

  // URLからファイルのkeyを抽出する関数
  const extractFileKeyFromUrl = (url) => {
    // URLからパス部分を取得
    const path = new URL(url).pathname;
    const key = `uploads/${path.split("uploads/")[1]}`;
    return key;
  };

  // s3へファイルをアップロードする関数
  const uploadS3 = useUploadS3();

  // バックエンドにfileKeyを送信
  const updateAvatar = useUpdateCommunitiesAvatar();

  return (
    <div className="container flex flex-col justify-start items-center my-20 max-w-[900px] bg-theme-black">
      {/* 画像セクション */}
      <div className="flex flex-col justify-start w-full sm:px-28 px-6 pt-10">
        <input
          type="file"
          id="image"
          accept="/image/*"
          style={{ display: "none" }}
          onChange={ImageSubmit}
        />
        <label htmlFor="image">
          <div className="w-40 h-40 mx-auto bg-gray-400 rounded-sm flex items-center justify-center cursor-pointer">
            {community.communityImage ? (
              <img
                src={community.communityImage}
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
          <p className="text-white text-center text-xl pt-8">
            コミュニティ画像
          </p>
        </label>
        <div className="flex justify-center pt-8">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={ImageSubmit}
            ref={inputRef} // inputRef は useRef() フックを使用して作成された参照です
          />
          <label htmlFor="image-upload">
            <Button
              label="画像をアップロード"
              variant="secondary"
              onClick={() => inputRef.current.click()} // Button をクリックしたときに input のクリックイベントを発火
            >
              画像をアップロード
            </Button>
          </label>
        </div>
      </div>

      {/* コミュニティ名 */}
      <form
        action=""
        className="flex flex-col justify-start w-full sm:px-28 px-6 py-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="communityName" className="text-white pt-8 text-lg">
          コミュニティネーム
        </label>
        <input
          type="text"
          id="communityName"
          className="p-1"
          {...register("communityName", {
            required: "コミュニティネームは必須です",
            maxLength: { value: 40, message: "40文字以内で入力してください" },
          })}
        />
        {errors.communityName && (
          <p className="text-red-500">{errors.communityName.message}</p>
        )}
        <label htmlFor="playlistName" className="text-white pt-8 text-lg">
          プレイリストネーム
        </label>
        <input
          type="text"
          id="playlistName"
          className="p-1"
          {...register("playlistName", {
            required: "プレイリストネームは必須です",
            maxLength: { value: 40, message: "40文字以内で入力してください" },
          })}
        />
        {errors.playlistName && (
          <p className="text-red-500">{errors.playlistName.message}</p>
        )}
        {/* 紹介文 */}
        <label htmlFor="Introduction" className="text-white pt-8 text-lg">
          紹介文
        </label>
        <textarea
          id="introduction"
          className="h-[80px] p-1"
          {...register("introduction", {
            maxLength: { value: 160, message: "160文字以内で入力してください" },
          })}
        ></textarea>
        {errors.introduction && (
          <p className="text-red-500">{errors.introduction.message}</p>
        )}
        {/* スイッチ制御 */}
        {/* <div className="flex justify-between items-center w-full pt-8 text-lg">
          <div className="flex flex-col">
            <h2 className="text-white">コメント</h2>
            <p className="text-theme-gray text-sm">
              コミュニティ外のコメントを許可
            </p>
          </div>
          <Switch className="sm:mr-10 mr-0" />
        </div>
        <div className="flex justify-between items-center w-full pt-8 text-lg">
          <div className="flex flex-col">
            <h2 className="text-white">公開</h2>
            <p className="text-theme-gray text-sm">
              コミュニティプレイリストを公開する
            </p>
          </div>
          <Switch className="sm:mr-10 mr-0" />
        </div> */}
        {/* 更新ボタン */}
        <div className="flex justify-center pt-16">
          <Button label="更新する" variant="secondary" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default CommunityEdit;
