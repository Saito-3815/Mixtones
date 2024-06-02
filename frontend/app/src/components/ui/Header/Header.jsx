import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

import { Button } from "@/components/ui/Button/Button";
import { AvatarMenu } from "../AvatarMenu/AvatarMenu";
import { BarMenu } from "@/components/ui/BarMenu/BarMenu";
import { AlertDialogSet } from "../AlertDialog/AlertDialog";

export const Header = ({ user }) => (
  <header className="mx-1 my-1">
    <div className="flex justify-between items-center px-4 py-5 bg-theme-black rounded-sm h-16">
      <div className="flex space-x-2 items-center">
        <FontAwesomeIcon icon={faSpotify} className="text-white text-4xl" />
        <h1 className="font-bold text-white text-2xl">Mixify</h1>
      </div>
      <div className="hidden md:flex">
        {user ? (
          <>
            <div className="flex items-center space-x-20 ">
              <AlertDialogSet
                triggerComponent={
                  <Button variant="secondary" label="コミュニティを作る" />
                }
                dialogTitle="新しいコミュニティが作成されます。よろしいですか？"
                dialogText="コミュニティを作成するとあなたのお気に入りが共有されます。"
                actionText="コミュニティを作る"
                cancelText="キャンセル"
              />
              <AvatarMenu />
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
        <BarMenu user={user} />
      </div>
    </div>
  </header>
);

Header.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

Header.defaultProps = {
  user: null,
};
