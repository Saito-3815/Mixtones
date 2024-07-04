import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
// import { Switch } from "@/components/ui/Switch/Switch";
import { Button } from "@/components/ui/Button/Button";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCommunity } from "@/api/communitiesShow";
import { updateCommunities } from "@/api/communitiesUpdate";

const CommunityEdit = () => {
  const { communityId } = useParams();

  // コミュニティ情報を取得
  const {
    data: communityData,
    // status: communityStatus,
    error: communityError,
  } = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => fetchCommunity({ communityId: communityId }),
  });

  // console.log(communityData);

  if (communityError) {
    console.error(communityError);
  }

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
    CommunityEdit.mutate(data);
  };

  const CommunityEdit = useMutation({
    mutationFn: (data, communityId) => updateCommunities(data, communityId),
    onSuccess: (data) => {
      if (data.status === 201) {
        console.log(data);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="container flex flex-col justify-start items-center my-20 max-w-[900px] bg-theme-black">
      <form
        action=""
        className="flex flex-col justify-start w-full sm:px-28 px-6 py-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 画像セクション */}
        <input
          type="file"
          id="image"
          accept="image/*"
          style={{ display: "none" }}
          {...register("image")}
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
        {/* コミュニティ名 */}
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
