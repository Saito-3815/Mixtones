import { uploadS3 } from "@/api/uploadS3";
import { useMutation } from "@tanstack/react-query";

export const useUploadS3 = () =>
  useMutation({
    mutationFn: uploadS3,
    onSuccess: async (data) => {
      if (data.status === 200) {
        console.log("アップロード後のレスポンス:", data);
      }
    },
    onError: (error) => {
      console.error("アップロードに失敗しました。", error);
      throw new Error("アップロードに失敗しました。");
    },
  });
