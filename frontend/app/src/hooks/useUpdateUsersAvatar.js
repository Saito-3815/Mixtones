import { updateUsersAvatar } from "@/api/usersAvatarUpdate";
import { loginUser, userAtom } from "@/atoms/userAtoms";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";

export const useUpdateUsersAvatar = () => {
  const navigate = useNavigate();

  const [, setUser] = useAtom(userAtom);

  return useMutation({
    mutationFn: updateUsersAvatar,
    onSuccess: (data) => {
      if (data.status === 200) {
        console.log("アバター更新のレスポンス:", data);
        loginUser(setUser, data.data.user);
        navigate(`/users/${data.data.user.id}`);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
