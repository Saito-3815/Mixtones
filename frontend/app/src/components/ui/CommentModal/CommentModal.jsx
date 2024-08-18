import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useComments } from "@/hooks/useComments";
import { format } from "date-fns";
import SendComment from "../SendComment/SendComment";

const CommentModal = ({ isOpen, onRequestClose, communityId, tuneId }) => {
  const commentStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#121212",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      width: "30%",  
      height: "60%", 
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  const {
    data: commentsData,
    error: commentsError,
    refetch: refetchComments,
  } = useComments(communityId, tuneId);

  // モーダルを開いた時にコメントを取得
  const handleAfterOpen = () => {
    refetchComments();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={commentStyles}
      onAfterOpen={handleAfterOpen}
    >
      {commentsError ? (
        <p className="text-red-500">エラーが発生しました: {commentsError.message}</p>
      ) : commentsData ? (
        commentsData.map(comment => (
          <div key={comment.id} className="text-white">
            <p>{comment.body}</p>
            <p>by {comment.user.name}</p>
            <p>at {format(new Date(comment.created_at), 'yyyy-MM-dd HH:mm:ss')}</p>
            <img
            src={comment.user.avatar}
            alt="images"
            className="object-cover h-10 w-10 rounded-sm flex-shrink-0"
          />
          </div>
        ))
      ) : (
        <p>コメント機能は現在開発中です</p>
      )}
      <SendComment 
        communityId={communityId}
        tuneId={tuneId}
      />
    </Modal>
  );
};

CommentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  communityId: PropTypes.string.isRequired,
  tuneId: PropTypes.string.isRequired,
};

export default CommentModal;
