// DotsMenu.stories.jsx
import React from "react";
import { DotsMenu } from "./DotsMenu";

export default {
  title: "DotsMenu",
  component: DotsMenu,
};

const Template = (args) => <DotsMenu {...args} />;

export const Default = Template.bind({});
Default.args = {};
