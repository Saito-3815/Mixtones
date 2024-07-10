import { updateCommunitiesAvatar } from "@/api/communitiesAvatarUpdate";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useUpdateCommunitiesAvatar = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateCommunitiesAvatar,
    onSuccess: (data) => {
      if (data.status === 200) {
        console.log("アバター更新のレスポンス:", data);
        navigate(`/communities/${data.data.id}`);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
