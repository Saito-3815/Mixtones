import { BarMenu } from "./BarMenu";

export default {
  title: "BarMenu",
  component: BarMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const LogIn = {
  args: {
    user: {
      name: "Jane Doe",
    },
  },
};

export const LogOut = {};
