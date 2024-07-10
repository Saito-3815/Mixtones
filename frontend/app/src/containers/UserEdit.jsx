import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { Switch } from "@/components/ui/Switch/Switch";
import { Button } from "@/components/ui/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
// import { AvatarSet } from "@/components/ui/Avatar/Avatar";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/api/usersShow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";

const userEdit = () => {
  const { userId } = useParams();

  const [loginUser] = useAtom(userAtom);

  const navigate = useNavigate();

  // ユーザー情報を取得
  const {
    data: userData,
    // status: userStatus,
    error: userError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser({ userId: userId }),
  });

  // console.log("userData:",userData);

  if (userError) {
    console.error(userError);
  }

  // ユーザーがこの編集ページのユーザーかどうかを確認
  const [isUser, setIsUser] = useState(true);

  useEffect(() => {
    if (loginUser && userData && userId) {
      setIsUser(loginUser.id === userId);
    }
  }, [loginUser, userData, userId]);

  // ユーザーが違う場合はエラーを表示してリダイレクト
  useEffect(() => {
    if (loginUser && userData && userId && isUser === false) {
      alert("エラー: 他のユーザーの情報は編集できません。");
      navigate(`/users/${userId}`);
    }
  }, [isUser, loginUser, userData, userId]);

  const user = {
    name: userData ? userData.name : "",
    introduction: userData ? userData.introduction : "",
    image: userData ? userData.avatar : "",
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    setValue("name", user.name);
    setValue("image", user.image);
    setValue("introduction", user.introduction);
  }, [userData]);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="container flex flex-col justify-start items-center my-20 max-w-[900px] bg-theme-black">
      {/* 画像セクション */}
      <div className="flex flex-col justify-start w-full sm:px-28 px-6 pt-10">
        <input
          type="file"
          id="image"
          accept="/image/*"
          style={{ display: "none" }}
          // onChange={ImageSubmit}
        />
        <label htmlFor="image">
          <div className="w-40 h-40 mx-auto bg-gray-400 rounded-sm flex items-center justify-center cursor-pointer">
            {user.image ? (
              <img
                src={user.image}
                alt=""
                className="object-cover object-center w-full h-full rounded-sm"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                className="w-3/4 h-3/4 text-gray-500 self-center"
              />
            )}
          </div>
          <p className="text-white text-center text-xl pt-8">ユーザー画像</p>
        </label>
        <div className="flex justify-center pt-8">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            style={{ display: "none" }}
            // onChange={ImageSubmit}
            // ref={inputRef} // inputRef は useRef() フックを使用して作成された参照です
          />
          <label htmlFor="image-upload">
            <Button
              label="画像をアップロード"
              variant="secondary"
              // onClick={() => inputRef.current.click()} // Button をクリックしたときに input のクリックイベントを発火
            >
              画像をアップロード
            </Button>
          </label>
        </div>
      </div>

      {/* ユーザー名 */}
      <form
        action=""
        className="flex flex-col justify-start w-full sm:px-28 px-6 py-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="userName" className="text-white pt-8 text-lg">
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
        {errors.userName && (
          <p className="text-red-500">{errors.userName.message}</p>
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
            <h2 className="text-white">公開</h2>
            <p className="text-theme-gray text-sm">
              チェックした楽曲を公開する
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

export default userEdit;
