import React from "react";
import { TuneColumn } from "./TuneColumn";

export default {
  title: "TuneColumn",
  component: TuneColumn,
};

const Template = (args) => <TuneColumn {...args} />;

export const Default = Template.bind({});
Default.args = {
  tune: {
    name: "Sample Tune",
    artist: "Sample Artist",
    album: "Sample Album",
    images: "https://picsum.photos/500",
    added_at: "2022-01-01T00:00:00Z",
    time: "00:00",
  },
  index: 0,
};

export const LongText = Template.bind({});
LongText.args = {
  tune: {
    name: "Sample Tune with a Very Long Name That Will Be Truncated in the UI for Display",
    artist:
      "Sample Artist with a Very Long Name That Will Be Truncated in the UI for Display",
    album:
      "Sample Album with a Very Long Name That Will Be Truncated in the UI for Display",
    images: "https://picsum.photos/500",
    added_at: "2022-01-01T00:00:00Z",
    time: "00:00",
  },
  index: 1,
};
