import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { loginUser, userAtom } from "@/atoms/userAtoms";
import { useMutation } from "@tanstack/react-query";
import { createPasswordUser } from "@/api/usersCreatePassword";
import { Switch } from "@/components/ui/Switch/Switch";
import { useState } from "react";
// import { useEffect } from "react";

const PassSignup = () => {
  const navigate = useNavigate();

  const [user, setUser] = useAtom(userAtom);

  const location = useLocation();
  const isPersistentFromState = location.state?.isPersistent ?? false;

  const [isPersistent, setIsPersistent] = useState(isPersistentFromState);

  // isPersistentの状態を監視してログに表示
  // useEffect(() => {
  //   console.log("isPersistent:", isPersistent);
  // }, [isPersistent]);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    passSignup.mutate({ ...data, isPersistent });
  };

  //  ユーザーのテキスト情報を更新
  const passSignup = useMutation({
    mutationFn: (data) => {
      return createPasswordUser(data);
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        // console.log(data);
        if (!user) {
          loginUser(setUser, data.data.user);
          navigate(`/`);
        }
      }
    },
    onError: (error) => {
      if (error.response) {
        console.error("サーバーからのエラーメッセージ:", error.response.data);
      } else {
        console.error("エラー:", error.message);
      }
    },
  });

  // Switchの状態を切り替える関数
  const toggleIsPersistent = () => {
    setIsPersistent(!isPersistent);
  };

  return (
    <div className="container flex flex-col justify-start items-center my-20 max-w-[500px] bg-theme-black rounded-sm">
      <form
        action=""
        className="flex flex-col justify-start w-full sm:px-20 px-6 py-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* ユーザー名 */}
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
        {/* <label htmlFor="Introduction" className="text-white pt-8 text-lg">
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
        )} */}
        {/* email */}
        <label htmlFor="email" className="text-white pt-8 text-lg">
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          className="p-1"
          {...register("email", {
            required: "メールアドレスは必須です",
            maxLength: { value: 40, message: "40文字以内で入力してください" },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "有効なメールアドレスを入力してください",
            },
          })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        {/* password */}
        <label htmlFor="password" className="text-white pt-8 text-lg">
          パスワード
        </label>
        <input
          type="password"
          id="password"
          className="p-1"
          {...register("password", {
            required: "パスワードは必須です",
            minLength: { value: 8, message: "8文字以上で入力してください" },
            maxLength: { value: 40, message: "40文字以内で入力してください" },
          })}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
        {/* password confirmation */}
        <label
          htmlFor="passwordConfirmation"
          className="text-white pt-8 text-lg"
        >
          パスワード（確認）
        </label>
        <input
          type="password"
          id="passwordConfirmation"
          className="p-1"
          {...register("passwordConfirmation", {
            required: "確認用パスワードは必須です",
            validate: (value) =>
              value === watch("password") || "パスワードが一致しません",
          })}
        />
        {errors.passwordConfirmation && (
          <p className="text-red-500">{errors.passwordConfirmation.message}</p>
        )}
        {/* ログイン状態を保持ボタン */}
        <div className="w-full max-w-[550px] flex items-center justify-center space-x-10 pt-12">
          <Switch checked={isPersistent} onChange={toggleIsPersistent} />
          <p className="text-white">ログイン状態を保持する。</p>
        </div>
        {/* 更新ボタン */}
        <div className="flex justify-center pt-16">
          <Button label="ユーザー登録する" variant="theme" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default PassSignup;
