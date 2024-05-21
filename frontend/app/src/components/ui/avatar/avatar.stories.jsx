import { AvatarSet } from "./Avatar";

export default {
  title: "Avatar",
  component: AvatarSet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: {
        type: "radio",
      },
      options: ["https://picsum.photos/200", ""],
    },
  },
};

export const NoImage = (args) => <AvatarSet {...args} />;

export const WithImage = NoImage.bind({});
WithImage.args = {
  src: "https://picsum.photos/200",
};

// export const User = {
//   component: AvatarSet,
//   args: {
//     src: "https://picsum.photos/200",
//   },
// };

// export function Default() {
//   return (
//     <Avatar>
//       <AvatarImage src="" alt="avatar" />
//       <AvatarFallback>
//         <FontAwesomeIcon icon={faUser} className="text-gray-500"/>
//       </AvatarFallback>
//     </Avatar>
//   )
// }
