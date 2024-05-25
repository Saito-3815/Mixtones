// AlertDialog.stories.jsx
import React from "react";
import { AlertDialogSet } from "./AlertDialog";
import { Button } from "../Button/Button";

export default {
  title: "AlertDialog",
  component: AlertDialogSet,
};

const Template = (args) => <AlertDialogSet {...args} />;

export const WithProps = Template.bind({});
WithProps.args = {
  triggerComponent: <Button label="コミュニティを作る" />,
  dialogTitle: "新しいコミュニティが作成されます。\nよろしいですか？",
  dialogText: "コミュニティを作成するとあなたのお気に入りが共有されます。",
  actionText: "コミュニティを作る",
  cancelText: "キャンセル",
};
