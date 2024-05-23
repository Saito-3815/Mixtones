import React from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

import { Button } from "@/components/ui/Button/Button";
import { AvatarMenu } from "../AvatarMenu/AvatarMenu";
import { BarMenu } from "@/components/ui/BarMenu/BarMenu";

export const Header = ({ user, onLogin, onLogout, onCreateAccount }) => (
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
              <Button
                variant="secondary"
                onClick={onLogout}
                label="コミュニティを作る"
              />
              <AvatarMenu />
            </div>
          </>
        ) : (
          <>
            <Button
              variant="link"
              primary
              onClick={onCreateAccount}
              label="サインアップ"
            />
            <Button variant="secondary" onClick={onLogin} label="ログイン" />
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
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: null,
};
