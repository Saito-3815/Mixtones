import { useForm } from "react-hook-form";
import SendIcon from "@mui/icons-material/Send";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComments } from "@/api/commentsCreate";
import { Input } from "@mui/material";

const SendComment = ({ communityId, tuneId}) => {
  const [user] = useAtom(userAtom);
  const userId = user.id;


  const {
    register,
    // setValue,
    handleSubmit,
    // formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    const dataWithId = { ...data, userId, communityId, tuneId };
    CommentCreate.mutate(dataWithId);
  };

  // コメントを送信
  const queryClient = useQueryClient();

  const CommentCreate = useMutation({
    mutationFn: (dataWithId) => {
      return createComments(dataWithId);
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        queryClient.setQueryData(["comment", communityId, tuneId], data.data);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-center w-full border-t border-gray-300 ml-[-5px] p-2 pb-5 bg-gray-100">
      <Input
        type="text"
        id="comment"
        className="p-1 w-5/6 text-base font-semibold ml-1 mb-[-3px]"
        placeholder="コメントを入力してください"
        {...register("comment", {})}
        />
      <button type="submit" className="bg-theme-orange text-white p-1 ml-2">
        <SendIcon size={24} />
      </button>
        </div>
    </form>
  );
};

SendComment.propTypes = {
  communityId: PropTypes.string.isRequired,
  tuneId: PropTypes.string.isRequired,
};

export default SendComment;
