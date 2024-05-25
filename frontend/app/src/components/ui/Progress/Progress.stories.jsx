import { Progress } from "./Progress";

export default {
  title: "Progress",
  component: Progress,
  tags: ["autodocs"],
};

const Template = (args) => <Progress {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: 50,
};
