// import { useParams } from "react
import PropTypes from "prop-types";
import { TuneTableChecked } from "@/components/ui/TuneTableChecked/TuneTableChecked";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchUser } from "@/api/usersShow";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";
import { Button } from "@/components/ui/Button/Button";

const User = () => {
  const { userId } = useParams();

  const [user] = useAtom(userAtom);

  // ユーザー情報を取得
  const {
    data: userData,
    status: userStatus,
    error: userError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser({ userId: userId }),
  });

  console.log("userData:", userData);

  if (userError) {
    console.error(userError);
  }

  return (
    <div className="flex-col justify-center">
      {/* ユーザーセクション */}
      <div className="container mt-10 flex flex-wrap items-start justify-between mx-auto py-10 bg-theme-black max-w-[1200px] rounded-md">
        {/* 画像 */}
        <div className="flex justify-center max-w-[240px] items-start pl-5 sm:pl-3">
          <div className="flex bg-gray-400 w-60 h-60 rounded-full items-center justify-center">
            {userStatus === "pending" || !userData ? (
              <Skeleton className="w-60 h-60 rounded-full" />
            ) : userData.avatar ? (
              <img
                src={userData.avatar}
                alt="User"
                className="w-60 h-60 rounded-full object-cover"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                className="w-3/4 h-3/4 text-gray-500 self-center"
              />
            )}
          </div>
        </div>
        {/* テキスト情報 */}
        {userStatus === "pending" || !userData ? (
          <div className="max-w-[480px] h-full flex flex-col items-start pr-40 overflow-hidden sm:p-0 p-5">
            <Skeleton className="h-20 w-[360px] mt-3" />
            <Skeleton className="h-6 w-[160px] mt-3" />
          </div>
        ) : (
          <div className="max-w-[480px] h-full flex flex-col items-start pr-40 overflow-hidden sm:p-0 p-5">
            <h1 className="text-white font-bold text-5xl mt-3 whitespace-nowrap">
              {userData.name}
            </h1>
            <p className="text-theme-gray text-md mt-5">
              {userData.introduction}
            </p>
          </div>
        )}
        {/* ボタン類 */}
        <div className="max-w-[480px] pr-10 flex flex-col h-full py-10 space-y-5">
          {user && parseInt(userId, 10) === user.id && (
            <Link to={`/users/${userId}/edit`}>
              <Button
                label="プロフィールを編集する"
                variant="secondary"
                className="w-[300px]"
              />
            </Link>
          )}
        </div>
      </div>

      {/* プレイリストセクション */}
      <div className="flex justify-center my-16">
        <TuneTableChecked />
      </div>
    </div>
  );
};

User.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default User;
