import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faCircleCheck,
  faCirclePlay,
  faForwardStep,
  faRepeat,
  faShuffle,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { Slider } from "@/components/ui/Slider/Slider";
import { Progress } from "@/components/ui/Progress/Progress";

const TuneFooter = ({ tune }) => {
  const [isCirclePlayIconClicked, setIsCirclePlayIconClicked] = useState(false);

  const handleCirclePlayIconClick = () => {
    setIsCirclePlayIconClicked(!isCirclePlayIconClicked);
  };

  return (
    <footer className="mx-1 my-1">
      <div className="grid grid-cols-3 items-center bg-theme-black rounded-sm h-[72px]">
        <div className="flex justify-start items-center space-x-3">
          <img
            src={`${tune.images.large}`}
            alt="images"
            className="object-cover h-12 w-12 bg-theme-gray rounded-sm ml-3"
          />
          <div className="">
            <h1 className="text-white text-sm font-extralight max-w-[343px] overflow-x-hidden whitespace-nowrap animate-marquee animation-duration-10000 animation-iteration-count-infinite">{`${tune.name}`}</h1>
            <h2 className="text-theme-gray text-xs font-extralight">{`${tune.artist}`}</h2>
          </div>
          <FontAwesomeIcon icon={faCircleCheck} className="text-white" />
        </div>
        <div className="flex justify-center items-center">
          <div className="items-center">
            <div className="flex justify-center items-center space-x-5 mt-2">
              <FontAwesomeIcon
                icon={faShuffle}
                className={`text-white h-4 w-4 ${isCirclePlayIconClicked ? "text-theme-orange" : "text-white"}`}
                onClick={handleCirclePlayIconClick}
              />
              <FontAwesomeIcon
                icon={faBackwardStep}
                className="text-white h-4 w-4"
              />
              <FontAwesomeIcon
                icon={faCirclePlay}
                className={`h-8 w-8 transform transition-transform duration-200 hover:scale-110 ${isCirclePlayIconClicked ? "text-theme-orange" : "text-white"}`}
                onClick={handleCirclePlayIconClick}
              />
              <FontAwesomeIcon
                icon={faForwardStep}
                className="text-white h-4 w-4"
              />
              <FontAwesomeIcon icon={faRepeat} className="text-white h-4 w-4" />
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-theme-gray text-xs font-extralight">{`${tune.time}`}</span>
              <Progress value={33} className="" />
              <span className="text-theme-gray text-xs font-extralight">{`${tune.time}`}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center">
          <FontAwesomeIcon icon={faVolumeHigh} className="text-white" />
          <Slider defaultValue={[33]} max={100} step={1} className="w-28" />
        </div>
      </div>
    </footer>
  );
};

export default TuneFooter;

TuneFooter.propTypes = {
  tune: PropTypes.shape({
    name: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    album: PropTypes.string.isRequired,
    images: PropTypes.shape({
      small: PropTypes.string.isRequired,
      large: PropTypes.string.isRequired,
    }).isRequired,
    time: PropTypes.string.isRequired,
  }),
};

TuneFooter.defaultProps = {
  tune: null,
};
