import React from "react";
import { useParams } from "react-router-dom";

const User = () => {
  const { usersId } = useParams();

  return (
    <div className="text-white">
      ユーザー情報
      <p>usersIdは {usersId} です</p>
    </div>
  );
};

export default User;
