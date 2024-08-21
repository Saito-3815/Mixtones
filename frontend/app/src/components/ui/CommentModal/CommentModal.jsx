import React, { useCallback } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useComments } from "@/hooks/useComments";
import { format } from "date-fns";
import SendComment from "../SendComment/SendComment";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";

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

  const [user] = useAtom(userAtom);

  const {
    data: commentsData,
    error: commentsError,
    refetch: refetchComments,
  } = useComments(communityId, tuneId);

  const comments = Array.isArray(commentsData) ? commentsData : [];

  // モーダルを開いた時にスクロールを最下部へ
  const scrollBottom = useCallback(
    (node) => {
      // 引数にnodeを受け取る
      if (!node) return; // nodeがnullの場合はリターンして処理終了
      node.scrollTop = node.scrollHeight;
    },
    [commentsData]
  );

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
          <div className="my-4 flex flex-col">
            {comments.map((comment) => (
              <div key={comment.id} className="flex flex-col">
                {/* <p>by {comment.user.name}</p> */}
                <p className={`font-light text-sm text-theme-gray ${user && comment.user.id === user.id ? "flex-row-reverse text-end float-right" : "float-left"}`}>
                  {format(new Date(comment.created_at), "yyyy/MM/dd HH:mm")}
                </p>
                <div
                  className={`flex p- pr-2.5 pb-0 pl-2 m-[10px] rounded-xl items-center
              ${user && comment.user.id === user.id ? "bg-theme-orange text-black flex-row-reverse text-end float-right" : "bg-white float-left"}
              `}
                >
                  <img
                    src={comment.user.avatar}
                    alt="images"
                    className="rounded-full h-[45px] border-1 my-1 border-black"
                  />
                  <p className="font-light text-sm my-[5px] ml-[5px] mr-[10px] break-words text-left">
                    {comment.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white">コメント機能は現在開発中です</p>
        )}
      </div>
      <div className="bg-gray-100">
        <SendComment communityId={communityId} tuneId={tuneId} />
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
