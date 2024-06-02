import { AvatarSet } from "./Avatar";

export default {
  title: "Avatar",
  component: AvatarSet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: {
        type: "radio",
      },
      options: ["https://picsum.photos/200", ""],
    },
  },
};

export const NoImage = (args) => <AvatarSet {...args} />;

export const WithImage = NoImage.bind({});
WithImage.args = {
  src: "https://picsum.photos/200",
};

// export const AvatarWithImage = () => <AvatarSet src="https://picsum.photos/200" />;
// AvatarWithImage.storyName = 'Avatar with image';
