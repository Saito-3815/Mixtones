import axios from "axios";
import { commentsCreate } from "@/urls/index";

export const createComments = ({ comment, userId, communityId, tuneId }) => {
  // console.log("userId:", userId, "communityId:", communityId, "tuneId:", tuneId, "comment:", comment);

  const url = commentsCreate(communityId, tuneId, userId);
  return axios.post(
    url, 
    {
      comment: {
        body: comment,
      }
    }, 
    { withCredentials: true });
};
