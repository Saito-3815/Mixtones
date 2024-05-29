import { TuneColumn } from "@/components/ui/TuneColumn/TuneColumn";
import PropTypes from "prop-types";

export const TuneTable = ({ tunes }) => {
  return (
    <table>
      <thead>
        <tr>
          <th className="text-left">#</th>
          <th className="text-left">タイトル</th>
          <th className="text-left">アルバム</th>
          <th className="text-left">追加日</th>
        </tr>
      </thead>
      <tbody>
        {tunes.map((tune, index) => (
          <TuneColumn tune={tune} index={index} key={index} />
        ))}
      </tbody>
    </table>
  );
};

TuneTable.propTypes = {
  tunes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      artist: PropTypes.string,
      album: PropTypes.string,
      images: PropTypes.string,
      added_at: PropTypes.string,
      time: PropTypes.string,
    }),
  ).isRequired,
};
