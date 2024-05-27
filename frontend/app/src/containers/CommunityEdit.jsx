import React from "react";
import { useParams } from "react-router-dom";

const CommunityEdit = () => {
  const { communitiesId } = useParams();

  return (
    <div className="text-white">
      コミュニティ編集
      <p>{communitiesId}を編集します</p>
    </div>
  );
};

export default CommunityEdit;
