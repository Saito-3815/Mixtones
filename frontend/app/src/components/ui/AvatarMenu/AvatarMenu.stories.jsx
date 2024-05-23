import { AvatarMenu } from "./AvatarMenu";

export default {
  title: "AvatarMenu",
  component: AvatarMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = (args) => <AvatarMenu {...args} />;
