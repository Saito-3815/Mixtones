import React, { useRef } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useComments } from "@/hooks/useComments";
import { format } from "date-fns";
import SendComment from "../SendComment/SendComment";

// アプリケーションのルート要素を設定
Modal.setAppElement("#root");

const CommentModal = ({ isOpen, onRequestClose, communityId, tuneId }) => {
  const commentStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#121212",
      padding: "0px",
      borderRadius: "10px",
      width: "30%",
      height: "60%",
      display: "flex", 
      flexDirection: "column", 
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

  const comments = Array.isArray(commentsData) ? commentsData : [];

  const modalContentRef = useRef(null);

  // モーダルを開いた時にコメントを取得
  const handleAfterOpen = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = modalContentRef.current.scrollHeight;
    }
    refetchComments();
  };

  // const scroll = useRef();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={commentStyles}
      onAfterOpen={handleAfterOpen}
    >
       <div className="flex-grow overflow-y-auto p-3"> 
      {commentsError ? (
        <p className="text-red-500">
          エラーが発生しました: {commentsError.message}
        </p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="text-white">
            <p>{comment.body}</p>
            <p>by {comment.user.name}</p>
            <p>
              at {format(new Date(comment.created_at), "yyyy-MM-dd HH:mm:ss")}
            </p>
            <img
              src={comment.user.avatar}
              alt="images"
              className="object-cover h-10 w-10 rounded-sm flex-shrink-0"
            />
          </div>
        ))
      ) : (
        <p className="text-white">コメント機能は現在開発中です</p>
      )}
      </div>
      <div className="bg-gray-100">
          <SendComment
            communityId={communityId}
            tuneId={tuneId}
            // scroll={scroll}
          />
          {/* <div ref={scroll}></div> */}
        </div>
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
