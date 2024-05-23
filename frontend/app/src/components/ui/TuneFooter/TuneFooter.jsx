import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { Slider } from "@/components/ui/Slider/Slider";

export const TuneFooter = ({ tune }) => (
  <footer className="mx-1 my-1">
    <div className="flex justify-between items-center bg-theme-black rounded-sm h-16">
      <div className="flex items-center">
        <img
          src={`${tune.images.large}`}
          alt="images"
          className="object-cover h-12 w-12 bg-theme-gray rounded-sm"
        />
        <div className="">
          <h1 className="text-white">{`${tune.name}`}</h1>
          <h2 className="text-theme-gray">{`${tune.artist}`}</h2>
        </div>
        <FontAwesomeIcon icon={faCircleCheck} className="text-white" />
      </div>
      <div className="classneme"></div>
      <div className="frex items-center">
        <FontAwesomeIcon icon={faVolumeHigh} className="text-white" />
        <Slider defaultValue={[33]} max={100} step={1} />
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
