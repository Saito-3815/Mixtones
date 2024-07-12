import { updateUsersAvatar } from "@/api/usersAvatarUpdate";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useUpdateUsersAvatar = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateUsersAvatar,
    onSuccess: (data) => {
      if (data.status === 200) {
        console.log("アバター更新のレスポンス:", data);
        navigate(`/users/${data.data.id}`);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
