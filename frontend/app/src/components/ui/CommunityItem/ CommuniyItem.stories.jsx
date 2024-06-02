import { CommunityItem } from "./CommunityItem";

export default {
  title: "CommunityItem",
  component: CommunityItem,
};

const Template = (args) => <CommunityItem {...args} />;

export const ShortText = Template.bind({});
ShortText.args = {
  imgSrc: "https://picsum.photos/500",
  communityName: "Short Name",
  playlistName: "Short Playlist",
  introduction: "Short Introduction",
};

export const LongText = Template.bind({});
LongText.args = {
  imgSrc: "https://picsum.photos/500",
  communityName: "This is a very long community name that should overflow",
  playlistName: "This is a very long playlist name that should overflow",
  introduction: "This is a very long introduction that should overflow",
};

export const NoImage = Template.bind({});
NoImage.args = {
  imgSrc: null,
  communityName: "No Image",
  playlistName: "No Image Playlist",
  introduction: "No Image Introduction",
};
