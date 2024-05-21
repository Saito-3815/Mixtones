import { DropdownMenuSet } from "./DropdownMenu";

export default {
  title: "DropdownMenu",
  component: DropdownMenuSet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = (args) => <DropdownMenuSet {...args} />;
