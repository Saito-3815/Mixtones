import { fetchCheckes } from "@/api/checksIndex";
import { useQuery } from "@tanstack/react-query";

// カスタムフック
export const useCheckTunes = (userId) => {
  const { data, status, error } = useQuery({
    queryKey: ["check_tunes", userId],
    queryFn: () => fetchCheckes({ userId }),
  });

  return { data, status, error };
};
