import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
// import { useComments } from "@/hooks/useComments";

const CommentModal = ({ isOpen, onRequestClose }) => {
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
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  // const {
  //   data: commentstData,
  //   error: commentstError,
  // } = useComments();

  // モーダルを開いた時にコメントを取得
  const handleAfterOpen = () => {
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={commentStyles}
      onAfterOpen={handleAfterOpen}
    >
      <div className="text-white">コメント機能は現在開発中です</div>
    </Modal>
  );
};

CommentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

export default CommentModal;
