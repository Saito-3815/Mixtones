import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PropTypes from "prop-types";

export const ColorIcon = ({ icon, mode, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <FontAwesomeIcon
      icon={icon}
      className={`h-4 w-4 transform transition-transform duration-200 hover:scale-110 ${mode ? "text-theme-orange" : "text-theme-white"}`}
      onClick={handleClick}
    />
  );
};

ColorIcon.propTypes = {
  icon: PropTypes.object.isRequired,
  mode: PropTypes.bool,
  onClick: PropTypes.func,
};
