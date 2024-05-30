// TuneTable.stories.jsx
import React from "react";
import { TuneTable } from "./TuneTable";

export default {
  title: "TuneTable",
  component: TuneTable,
};

const Template = (args) => <TuneTable {...args} />;

export const Default = Template.bind({});
Default.args = {
  tunes: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Tune ${i + 1}`,
    artist: `Artist ${i + 1}`,
    album: `Album ${i + 1}`,
    images: "https://picsum.photos/500",
    added_at: "2022-01-01T00:00:00Z",
    time: "00:00",
  })),
  index: 0,
};

export const LongText = Template.bind({});
LongText.args = {
  tunes: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Tune ${i + 1} with a very long name that exceeds the normal length`,
    artist: `Artist ${i + 1} with a very long name that exceeds the normal length`,
    album: `Album ${i + 1} with a very long name that exceeds the normal length and is very long`,
    images: "https://picsum.photos/500",
    added_at: "2022-01-01T00:00:00Z",
    time: "00:00",
  })),
  index: 0,
};
