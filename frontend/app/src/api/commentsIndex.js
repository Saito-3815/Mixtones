import axios from "axios";
import { commentsIndex } from "@/urls/index";

export const fetchComments = async ({ communityId, tuneId }) => {
  const url = commentsIndex(communityId, tuneId);
  const { data } = await axios.get(url);
  return data;
};
