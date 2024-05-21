import { fn } from "@storybook/test";
import { Button } from "./Button";

export default {
  title: "Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
        "theme",
      ],
      control: { type: "radio" },
    },
    size: {
      options: ["default", "sm", "lg", "icon"],
      control: { type: "radio" },
    },
    backgroundColor: {
      control: { type: "color" },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Bass = {
  args: {
    variants: "default",
    label: "Button",
  },
};

export const WhiteButton = {
  args: {
    variants: "default",
    label: "ログイン",
    className: "text-black",
  },
};

export const ThemeButton = {
  args: {
    variants: "theme",
    label: "コミュニティ情報を編集",
    className: "text-black  ",
  },
};

export const LinkButton = {
  args: {
    variants: "link",
    label: "サインアップ",
  },
};
