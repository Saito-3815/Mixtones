import { SortMenu } from "./SortMenu";

export default {
  title: "SortMenu",
  component: SortMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = (args) => <SortMenu {...args} />;
