import { fn } from "@storybook/test";
import { Button } from "./button";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: "select" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Bass = {
  args: {
    primary: true,
    label: "Button",
  },
};

export function LoginButton() {
  return <Button className="text-black text-xl ">ログイン</Button>;
}
export function CommunityButton() {
  return <Button className="text-black text-xl ">コミュニティを作る</Button>;
}
// export function DestructiveButton() {
//   return <Button variant="destructive" className="text-black text-xl ">コミュニティを作る</Button>;
// }
// export function OutlineButton() {
//   return <Button variant="outline" className="text-black text-xl ">コミュニティを作る</Button>;
// }
// export function CommunityButton4() {
//   return <Button variant="secondary" className="text-black text-xl ">コミュニティを作る</Button>;
// }
// export function CommunityButton5() {
//   return <Button variant="ghost" className="text-black text-xl ">コミュニティを作る</Button>;
// }
// export function CommunityButton6() {
//   return <Button variant="link" className="text-black text-xl ">コミュニティを作る</Button>;
// }
