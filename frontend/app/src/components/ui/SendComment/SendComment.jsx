import { useForm } from 'react-hook-form';
import SendIcon from "@mui/icons-material/Send";
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtoms';
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComments } from '@/api/commentsCreate';

const SendComment = ({communityId, tuneId}) => {
  const [ user ] = useAtom(userAtom);
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
      const { userId, communityId, tuneId, ...data } = dataWithId;
      return createComments(data, userId, communityId, tuneId);
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        queryClient.setQueryData(["comment", communityId, tuneId], data);
        // console.log(data);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
          type="text"
          id="comment"
          className="p-1"
          placeholder='コメントを入力してください'
          {...register("comment", {
          })}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-1 ml-2"
        >
          <SendIcon size={24} />
        </button>
    </form>
  )
}

SendComment.propTypes = {
  communityId: PropTypes.string.isRequired,
  tuneId: PropTypes.string.isRequired,
};

export default SendComment
