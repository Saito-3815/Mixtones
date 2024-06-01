// TuneColumnChecked.stories.jsx
import React from "react";
import { TuneColumnChecked } from "./TuneColumnChecked";

export default {
  title: "TuneColumnChecked",
  component: TuneColumnChecked,
};

const Template = (args) => <TuneColumnChecked {...args} />;

export const Default = Template.bind({});
Default.args = {
  tune: {
    name: "Song Name",
    artist: "Artist Name",
    album: "Album Name",
    images: "https://picsum.photos/500",
    added_at: "2022-01-01T00:00:00Z",
    time: "00:00",
  },
  index: 1,
};
