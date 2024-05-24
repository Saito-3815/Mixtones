import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faCircleCheck,
  faForwardStep,
  faRepeat,
  faShuffle,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { Slider } from "@/components/ui/Slider/Slider";
import { Progress } from "@/components/ui/Progress/Progress";
import { ColorIcon } from "@/components/ui/ColorIcon/ColorIcon";
import { PlayIcon } from "../PlayIcon/PlayIcon";

export const TuneFooter = ({ tune }) => (
  <footer className="mx-1 my-1">
    <div className="grid grid-cols-3 items-center bg-theme-black rounded-sm h-[72px]">
      {/* 楽曲データ */}
      <div className="flex flex-grow flex-shrink justify-start items-center space-x-3 pr-5 col-span-3 md:col-span-1">
        <img
          src={`${tune.images.large}`}
          alt="images"
          className="object-cover h-12 w-12 bg-theme-gray rounded-sm ml-3"
        />
        {/* <div className="max-w-[343px]"> */}
        <div className="max-w-full overflow-hidden">
          <h1 className="text-white text-sm font-extralight whitespace-nowrap marquee ">{`${tune.name}`}</h1>
          <h2 className="text-theme-gray text-xs font-extralight">{`${tune.artist}`}</h2>
        </div>
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-white hidden md:flex"
        />
      </div>
      {/* 再生コントロール */}
      <div className="flex-grow flex-shrink justify-center items-center hidden md:flex">
        <div className="items-center w-full">
          <div className="flex justify-center items-center space-x-5 mt-2">
            <ColorIcon icon={faShuffle} />
            <FontAwesomeIcon
              icon={faBackwardStep}
              className="h-4 w-4 text-theme-white hover:text-white active:text-theme-white"
            />
            <PlayIcon />
            <FontAwesomeIcon
              icon={faForwardStep}
              className="h-4 w-4 text-theme-white hover:text-white active:text-theme-white"
            />
            <ColorIcon icon={faRepeat} />
          </div>
          <div className="flex flex-grow flex-shrink items-center space-x-2 mt-1">
            <span className="text-theme-gray text-xs font-extralight">{`${tune.time}`}</span>
            <Progress value={33} className="" />
            <span className="text-theme-gray text-xs font-extralight">{`${tune.time}`}</span>
          </div>
        </div>
      </div>
      {/* モバイル再生ボタン */}
      {/* 音量調整 */}
      <div className="flex-grow flex-shrink justify-end items-center hidden md:flex">
        <div className="flex flex-grow flex-shrink justify-end items-center space-x-3 mr-10">
          <FontAwesomeIcon icon={faVolumeHigh} className="text-white" />
          <Slider defaultValue={[33]} max={100} step={1} className="w-28" />
        </div>
      </div>
    </div>
  </footer>
);

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
