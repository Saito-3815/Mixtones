import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/Switch/Switch";
import { Button } from "@/components/ui/Button/Button";
import { useParams } from "react-router-dom";
import { AvatarSet } from "@/components/ui/Avatar/Avatar";

const userEdit = () => {
  const { usersId } = useParams();

  const user = {
    name: `${usersId}のユーザーネーム`,
    introduction: "",
    image: "",
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("name", user.name);
    setValue("playlistName", user.playlistName);
    setValue("introduction", user.introduction);
  }, [setValue]);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="container flex flex-col justify-start items-center mt-20 max-w-[900px] bg-theme-black">
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
          <div className="mx-auto flex items-center justify-center cursor-pointer">
            <AvatarSet src={`${user.image}`} size={40} />
          </div>
          <p className="text-white text-center text-xl pt-8">ユーザー画像</p>
        </label>
        {/* ユーザー名 */}
        <label htmlFor="name" className="text-white pt-8 text-lg">
          ユーザーネーム
        </label>
        <input
          type="text"
          id="name"
          className="p-1"
          {...register("name", {
            required: "ユーザーネームは必須です",
            maxLength: { value: 40, message: "40文字以内で入力してください" },
          })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
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
        <div className="flex justify-between items-center w-full pt-8 text-lg">
          <div className="flex flex-col">
            <h2 className="text-white">公開</h2>
            <p className="text-theme-gray text-sm">
              チェックした楽曲を公開する
            </p>
          </div>
          <Switch className="sm:mr-10 mr-0" />
        </div>
        {/* 更新ボタン */}
        <div className="flex justify-center pt-16">
          <Button label="更新する" variant="secondary" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default userEdit;
