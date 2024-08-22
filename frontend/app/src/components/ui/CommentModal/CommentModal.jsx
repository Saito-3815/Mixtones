import React, { useCallback } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useComments } from "@/hooks/useComments";
import { format } from "date-fns";
import SendComment from "../SendComment/SendComment";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";
import { AvatarSet } from "../Avatar/Avatar";
import "./CommentModal.css";

// アプリケーションのルート要素を設定
Modal.setAppElement("#root");

const CommentModal = ({ isOpen, onRequestClose, communityId, tuneId }) => {
  const [user] = useAtom(userAtom);

  const {
    data: commentsData,
    error: commentsError,
    refetch: refetchComments,
  } = useComments(communityId, tuneId);

  const comments = Array.isArray(commentsData?.comments)
    ? commentsData?.comments
    : [];

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
    refetchComments;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="Modal"
      overlayClassName="Overlay"
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
              <div
                key={comment.id}
                className={`flex items-end ${user && comment.user.id === user.id ? "justify-end" : "justify-end flex-row-reverse"}`}
              >
                <p className="font-light text-sm text-theme-gray mb-[10px]">
                  {format(new Date(comment.created_at), "yyyy/MM/dd HH:mm")}
                </p>
                <div
                  className={`flex p- pr-2.5 pb-0 pl-2 m-[10px] rounded-xl items-center
        ${user && comment.user.id === user.id ? "bg-theme-orange text-black flex-row-reverse text-end" : "bg-white flex-row"}
        `}
                >
                  {/* <img
                    src={comment.user.avatar}
                    alt="images"
                    className="rounded-full h-[45px] border-1 my-1 border-black"
                  /> */}
                  <div className="border-1 my-1 border-black">
                    <AvatarSet src={comment.user.avatar} size="8" />
                  </div>
                  <p className="font-light text-sm my-[5px] ml-[5px] mr-[10px] break-words text-left">
                    {comment.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white">コメントはまだありません。</p>
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
