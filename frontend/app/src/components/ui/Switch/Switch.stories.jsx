// Switch.stories.jsx
import React, { useState } from "react";
import { Switch } from "./Switch";

export default {
  title: "Switch",
  component: Switch,
};

const Template = (args) => {
  const [checked, setChecked] = useState(args.checked);
  const handleClick = () => setChecked(!checked);

  return <Switch {...args} checked={checked} onClick={handleClick} />;
};

export const Default = Template.bind({});
Default.args = {
  checked: false,
};

export const Checked = Template.bind({});
Checked.args = {
  checked: true,
};
