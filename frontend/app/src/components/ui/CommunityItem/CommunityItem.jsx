import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";

export const CommunityItem = ({ imgSrc }) => {
  return (
    <div className="w-[200px] h-[260px] bg-black hover:bg-theme-black rounded-sm pt-5 box-content">
      <div className="w-40 h-40 mx-auto bg-gray-400 rounded-sm flex items-center justify-center">
        {imgSrc ? (
          <img
            src={imgSrc}
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
      <div className="px-5">
        <h1 className="text-white">Community Name</h1>
        <p className="text-theme-gray text-sm">プレイリスト名</p>
        <p className="text-theme-gray text-sm">紹介文</p>
      </div>
    </div>
  );
};

CommunityItem.propTypes = {
  imgSrc: PropTypes.string,
};
