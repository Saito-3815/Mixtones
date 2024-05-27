// CommunityItem.stories.jsx
import React from "react";
import { CommunityItem } from "./CommunityItem";

export default {
  title: "CommunityItem",
  component: CommunityItem,
};

const Template = (args) => <CommunityItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  imgSrc: "https://picsum.photos/200",
};

export const NoImage = Template.bind({});
NoImage.args = {};
