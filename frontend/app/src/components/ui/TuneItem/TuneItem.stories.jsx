import React from "react";
import { TuneItem } from "./TuneItem";

export default {
  title: "TuneItem",
  component: TuneItem,
};

const Template = (args) => <TuneItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  tune: {
    name: "Sample Tune",
    artist: "Sample Artist",
    album: "Sample Album",
    images: {
      large: "https://picsum.photos/500",
    },
    added_at: "2022-01-01T00:00:00Z",
    time: "00:00",
  },
  index: 0,
};
