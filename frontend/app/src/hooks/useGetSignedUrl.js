// useGetSignedUrl.js
import { createSignedUrl } from "@/api/imagesCreate";
import { useMutation } from "@tanstack/react-query";

export const useGetSignedUrl = () =>
  useMutation({
    mutationFn: createSignedUrl,
    onSuccess: (data) => {
      if (data.status === 200) {
        console.log("署名付きURLの取得に成功:", data.data.url);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
