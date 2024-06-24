import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

import { Button } from "@/components/ui/Button/Button";
import { AvatarMenu } from "../AvatarMenu/AvatarMenu";
import { BarMenu } from "@/components/ui/BarMenu/BarMenu";
import { AlertDialogSet } from "../AlertDialog/AlertDialog";
import { isLoggedInAtom } from "@/atoms/userAtoms";
import { useAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { createCommunity } from "@/api/communitiesCreate";

export const Header = () => {
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  const handleCreateCommunity = useMutation({
    mutationFn: createCommunity,
    onSuccess: (data) => {
      if (data.status === 200) {
        console.log("Community created");
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
    <header className="mx-1 my-1">
      <div className="flex justify-between items-center px-4 py-5 bg-theme-black rounded-sm h-16">
        <Link to="/">
          <div className="flex space-x-2 items-center">
            <FontAwesomeIcon icon={faSpotify} className="text-white text-4xl" />
            <h1 className="font-bold text-white text-2xl">Mixify</h1>
          </div>
        </Link>
        <div className="hidden md:flex">
          {isLoggedIn ? (
            <>
              <div className="flex items-center space-x-20 ">
                <AlertDialogSet
                  triggerComponent={
                    <Button variant="secondary" label="コミュニティを作る" />
                  }
                  dialogTitle="新しいコミュニティが作成されます。よろしいですか？"
                  dialogText="コミュニティを作成するとあなたのお気に入りが共有されます。"
                  actionText="コミュニティを作る"
                  onActionClick={handleCreateCommunity.mutate}
                  cancelText="キャンセル"
                />
                <AvatarMenu src="" />
              </div>
            </>
          ) : (
            <>
              <Link to="/signup">
                <Button variant="link" label="サインアップ" />
              </Link>
              <Link to="/login">
                <Button variant="secondary" label="ログイン" />
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <BarMenu />
        </div>
      </div>
    </header>
  );
};
