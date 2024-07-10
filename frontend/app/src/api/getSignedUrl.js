// import { useGetSignedUrl } from "@/hooks/useGetSignedUrl";
// import { createSignedUrl } from "./imagesCreate";

export const fetchSignedUrl = (file, getSignedUrl) => {
  // const getSignedUrl = useGetSignedUrl(createSignedUrl);

  return new Promise((resolve, reject) => {
    getSignedUrl.mutate(file, {
      onSuccess: (data) => {
        if (data.status === 200) {
          resolve(data);
        } else {
          reject(new Error("signedUrlを取得できませんでした。"));
        }
      },
      onError: (error) => {
        reject(error);
      },
    });
  });
};
