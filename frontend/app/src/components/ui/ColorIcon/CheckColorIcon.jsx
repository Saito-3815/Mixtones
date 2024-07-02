import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PropTypes from "prop-types";

export const CheckColorIcon = ({ icon, isTuneChecked, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <FontAwesomeIcon
      icon={icon}
      className={`h-4 w-4 transform transition-transform duration-200 hover:scale-110 ${isTuneChecked ? "text-theme-orange" : "text-theme-white"}`}
      onClick={handleClick}
    />
  );
};

CheckColorIcon.propTypes = {
  icon: PropTypes.object.isRequired,
  isTuneChecked: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};
