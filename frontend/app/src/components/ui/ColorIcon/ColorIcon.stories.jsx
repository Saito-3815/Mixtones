import React from "react";
import {
  faBackwardStep,
  faForwardStep,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import ColorIcon from "./ColorIcon";

export default {
  title: "ColorIcon",
  component: ColorIcon,
};

const Template = (args) => <ColorIcon {...args} />;

export const PlayIcon = Template.bind({});
PlayIcon.args = {
  icon: faBackwardStep,
};

export const PauseIcon = Template.bind({});
PauseIcon.args = {
  icon: faForwardStep,
};

export const StopIcon = Template.bind({});
StopIcon.args = {
  icon: faRepeat,
};
