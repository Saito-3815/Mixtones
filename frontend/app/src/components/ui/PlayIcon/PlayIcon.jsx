import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faPauseCircle } from "@fortawesome/free-solid-svg-icons";

import PropTypes from "prop-types";

export const PlayIcon = ({ color, size }) => {
  const [currentIcon, setCurrentIcon] = useState(faCirclePlay);

  const handleClick = () => {
    setCurrentIcon((prevIcon) =>
      prevIcon === faCirclePlay ? faPauseCircle : faCirclePlay,
    );
  };

  return (
    <FontAwesomeIcon
      icon={currentIcon}
      onClick={handleClick}
      className={`h-${size} w-${size} transform transition-transform duration-200 hover:scale-110 ${color}`} // colorプロパティで色を変更できるようにする
    />
  );
};

PlayIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
};
