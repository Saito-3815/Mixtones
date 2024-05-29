// src/stories/DemoPage.stories.js
import React from "react";
import DemoPage from "./Page";

export default {
  title: "DemoPage",
  component: DemoPage,
};

const Template = (args) => <DemoPage {...args} />;

export const Default = Template.bind({});
Default.args = {};
