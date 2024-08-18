import axios from "axios";
import { commentsCreate } from "@/urls/index";

export const createComments = ({ data, userId, communityId, tuneId }) => {
  const url = commentsCreate(communityId, tuneId);
  return axios.post(
    url, 
    {
      comment: {
        community_id: communityId,
        tune_id: tuneId,
        user_id: userId,
        body: data,
      }
    }, 
    { withCredentials: true });
};
