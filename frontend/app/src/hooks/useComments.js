import { fetchComments } from "@/api/commentsIndex";
import { useQuery } from "@tanstack/react-query";

// カスタムフック
export const useComments = (communityId, tuneId) => {
  const { data, error } = useQuery({
    queryKey: ["comment", communityId, tuneId],
    queryFn: () => fetchComments({ communityId, tuneId }),
  });

  return { data, error };
};
