// import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faPauseCircle } from "@fortawesome/free-solid-svg-icons";

import PropTypes from "prop-types";
import { useAtom } from "jotai";
import { isPlayingAtom } from "@/atoms/tuneAtom";
import { playerAtom } from "@/atoms/playerAtom";

export const PlayIcon = ({ color, size, onClick }) => {
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [player] = useAtom(playerAtom);

  const handleClick = () => {
    if (player) {
      // playerがnullでない場合のみ以下を実行
      setIsPlaying(!isPlaying);
      if (onClick) {
        onClick();
      }
    } else {
      onClick();
    }
  };

  return (
    <FontAwesomeIcon
      // icon={currentIcon}
      icon={isPlaying ? faPauseCircle : faCirclePlay}
      onClick={handleClick}
      className={`h-${size} w-${size} transform transition-transform duration-200 hover:scale-110 ${color}`} // colorプロパティで色を変更できるようにする
    />
  );
};

PlayIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
};
