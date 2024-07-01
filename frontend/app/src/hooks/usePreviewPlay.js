import { useEffect, useState } from "react";

const usePreviewPlay = (previewUrl) => {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 既存の再生を停止し、Audio インスタンスをクリア
    if (audio) {
      audio.pause();
      setAudio(null);
    }

    // 新しい URL がある場合、新しい Audio インスタンスを作成して再生
    if (previewUrl) {
      const newAudio = new Audio(previewUrl);
      newAudio.play();
      setAudio(newAudio);

      // コンポーネントがアンマウントされるか、URL が変更された場合に再生を停止
      return () => {
        newAudio.pause();
      };
    }
  }, [previewUrl]);

  // オーディオを一時停止する関数
  const pauseAudio = () => {
    if (audio && isPlaying) {
      audio.pause();
      setIsPlaying(false); // 一時停止したときに状態を更新
    }
  };

  // 一時停止関数を返す
  return { pauseAudio };
};

export default usePreviewPlay;
