import { BarMenu } from "./BarMenu";

export default {
  title: "BarMenu",
  component: BarMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = (args) => <BarMenu {...args} />;
