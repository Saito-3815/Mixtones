import { Header } from "./Header";
import { fn } from "@storybook/test";

export default {
  title: "Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    onLogin: fn(),
    onLogout: fn(),
    onCreateAccount: fn(),
  },
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
};

export const LogIn = {
  args: {
    user: {
      name: "Jane Doe",
    },
  },
};

export const LogOut = {};
