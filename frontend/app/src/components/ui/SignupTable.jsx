import { Button } from "@/components/ui/Button/Button";
import { Switch } from "@/components/ui/Switch/Switch";
import PropTypes from "prop-types";

export const SignupTable = ({
  title,
  description,
  button1Label,
  button2Label,
}) => {
  return (
    <div className="container flex flex-col bg-theme-black max-w-[890px] max-h-[840px] h-full mx-auto my-8 rounded-sm justify-center items-center overflow-hidden">
      <div className="w-full max-w-[550px] mx-auto items-center text-center">
        <h1 className="text-white text-2xl pt-24 ">{title}</h1>
        <p className="text-theme-gray pt-12">{description}</p>
      </div>
      <div className="w-full max-w-[550px] flex items-center justify-center space-x-10 pt-12">
        <Switch />
        <p className="text-white">ログイン状態を保持する。</p>
      </div>
      <div className="w-full max-w-[550px] flex flex-col items-center space-y-12 pt-12 pb-24">
        <Button
          label={button1Label}
          className="bg-theme-green hover:bg-theme-green/90 w-[290px]"
        />
        <Button label={button2Label} className="bg-theme-orange w-[290px]" />
      </div>
    </div>
  );
};

SignupTable.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  button1Label: PropTypes.string.isRequired,
  button2Label: PropTypes.string.isRequired,
};
