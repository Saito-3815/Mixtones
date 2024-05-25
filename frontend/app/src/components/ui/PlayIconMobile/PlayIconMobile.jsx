import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

import PropTypes from "prop-types";

export const PlayIcon = () => {
  const [currentIcon, setCurrentIcon] = useState(faPlay);

  const handleClick = () => {
    setCurrentIcon((prevIcon) => (prevIcon === faPlay ? faPause : faPlay));
  };

  return (
    <FontAwesomeIcon
      icon={currentIcon}
      onClick={handleClick}
      className="h-8 w-8 transform transition-transform duration-200 hover:scale-110 text-white"
    />
  );
};

PlayIcon.propTypes = {
  icon: PropTypes.object.isRequired,
};
