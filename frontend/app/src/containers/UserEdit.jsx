import React from "react";
import { useParams } from "react-router-dom";

const UserEdit = () => {
  const { usersId } = useParams();

  return (
    <div className="text-white">
      ユーザー編集
      <p>{usersId}を編集します</p>
    </div>
  );
};

export default UserEdit;
