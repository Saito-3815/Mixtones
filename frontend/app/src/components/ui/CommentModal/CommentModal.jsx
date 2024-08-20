import React, { useCallback } from "react";
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

  // モーダルを開いた時にスクロールを最下部へ
  const scrollBottom = useCallback((node) => {
    // 引数にnodeを受け取る
    if (!node) return; // nodeがnullの場合はリターンして処理終了
    node.scrollTop = node.scrollHeight;
  }, [commentsData]);

  // モーダルを開いた時にコメントを取得
  const handleAfterOpen = () => {
    refetchComments();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={commentStyles}
      onAfterOpen={handleAfterOpen}
    >
      <div className="flex-grow overflow-y-auto p-3" ref={scrollBottom}>
        {commentsError ? (
          <p className="text-red-500">
            エラーが発生しました: {commentsError.message}
          </p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="text-white flex p-[20px_10px_0_20px] m-[20px] rounded-[3000px] shadow-[0_0_10px_rgb(164,164,164)] items-center">
              <p>{comment.body}</p>
              <p>by {comment.user.name}</p>
              <p>
                at {format(new Date(comment.created_at), "yyyy-MM-dd HH:mm:ss")}
              </p>
              <img
                src={comment.user.avatar}
                alt="images"
                className="rounded-full h-[45px] mt-[-20px] border-2 border-black"
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
        />
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
