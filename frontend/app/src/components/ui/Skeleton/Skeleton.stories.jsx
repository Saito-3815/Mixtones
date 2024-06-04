import React from "react";
import { Skeleton } from "./Skeleton";

export default {
  title: "Skeleton",
  component: Skeleton,
};

const Template = (args) => <Skeleton {...args} />;

export const Default = Template.bind({});
Default.args = {
  className: "w-[100px] h-[20px] rounded-full",
};
