// PlayIconMobile.stories.jsx
import React from "react";
import { PlayIcon } from "./PlayIconMobile";

export default {
  title: "PlayIconMobile",
  component: PlayIcon,
};

const Template = (args) => <PlayIcon {...args} />;

export const Default = Template.bind({});
Default.args = {};
