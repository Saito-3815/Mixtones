import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
// import { useParams } from "react-router-dom";

const CommunityEdit = () => {
  // const { communitiesId } = useParams();

  const userImageUrl = "https://picsum.photos/500";

  return (
    <div className="container flex flex-col justify-start items-center mt-20 max-w-[900px] bg-theme-black">
      <form action="" className="flex flex-col justify-start w-full px-5">
        {/* 画像セクション */}
        <input
          type="file"
          id="image"
          accept="image/*"
          style={{ display: "none" }}
        />
        <label htmlFor="image">
          <div className="w-40 h-40 mx-auto bg-gray-400 rounded-sm flex items-center justify-center cursor-pointer">
            {userImageUrl ? (
              <img
                src={userImageUrl}
                alt=""
                className="object-cover object-center w-full h-full rounded-sm"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserGroup}
                className="w-3/4 h-3/4 text-gray-500 self-center"
              />
            )}
          </div>
          <p className="text-white text-center">コミュニティ画像を変更する</p>
        </label>
        {/* コミュニティ名 */}
        <label htmlFor="communityName" className="text-white">
          コミュニティネーム
        </label>
        <input type="text" id="communityName" />
        {/* 紹介文 */}
        <label htmlFor="Introduction" className="text-white">
          紹介文
        </label>
        <input type="text" id="introduction" />
      </form>
    </div>
  );
};

export default CommunityEdit;
