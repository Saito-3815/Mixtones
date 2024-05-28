import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";

export const CommunityItem = ({
  imgSrc,
  communityName,
  playlistName,
  introduction,
}) => {
  const communityNameRef = useRef(null);
  const playlistNameRef = useRef(null);
  const introductionRef = useRef(null);

  useEffect(() => {
    const checkScroll = (element) => {
      if (element.scrollWidth > element.clientWidth) {
        element.classList.add("scroll-slide");
      }
    };

    checkScroll(communityNameRef.current);
    checkScroll(playlistNameRef.current);
    checkScroll(introductionRef.current);
  }, []);

  return (
    <div className="w-[280px] h-[340px] sm:w-[200px] sm:h-[260px] bg-black hover:bg-theme-black rounded-sm pt-5 box-content">
      <div className="w-60 h-60 sm:w-40 sm:h-40 mx-auto bg-gray-400 rounded-sm flex items-center justify-center">
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
      <div className="px-5 pt-5">
        <div className="overflow-x-hidden relative">
          <h1
            ref={communityNameRef}
            className="text-white whitespace-nowrap overflow-x-visible"
          >
            {communityName}
          </h1>
        </div>
        <div className="overflow-x-hidden relative">
          <p
            ref={playlistNameRef}
            className="text-theme-gray text-xs whitespace-nowrap overflow-x-visible"
          >
            {playlistName}
          </p>
        </div>
        <div className="overflow-x-hidden relative">
          <p
            ref={introductionRef}
            className="text-theme-gray text-xs whitespace-nowrap overflow-x-visible"
          >
            {introduction}
          </p>
        </div>
      </div>
    </div>
  );
};

CommunityItem.propTypes = {
  imgSrc: PropTypes.string,
  communityName: PropTypes.string.isRequired,
  playlistName: PropTypes.string.isRequired,
  introduction: PropTypes.string.isRequired,
};
