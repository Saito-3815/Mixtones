// WordFooter.stories.jsx
import React from "react";
import { WordFooter } from "./WordFooter";

export default {
  title: "WordFooter",
  component: WordFooter,
};

const Template = (args) => <WordFooter {...args} />;

export const Default = Template.bind({});
Default.args = {};
