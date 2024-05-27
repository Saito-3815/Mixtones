import React from "react";
import { useParams } from "react-router-dom";

const Community = () => {
  const { communitiesId } = useParams();

  return (
    <div className="text-white">
      コミュニティ情報
      <p>communitiesIdは {communitiesId} です</p>
    </div>
  );
};

export default Community;
