import axios from "axios";

export const fetchUser = (accessToken) =>
  axios
    .get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(
      (response) => response.data, // 返り値をresという名前で取得し、res.dataでレスポンスの中身だけをreturn
    )
    .catch((error) => {
      if (error.response) {
        // サーバーからのエラーレスポンス
        console.error("エラーレスポンスデータ:", error.response.data);
        console.error("ステータスコード:", error.response.status);
        console.error("ヘッダー:", error.response.headers);
      } else if (error.request) {
        // リクエストが行われましたが、応答がありませんでした
        console.error("リクエストが行われましたが、応答がありませんでした");
      } else {
        // エラーをトリガーしたリクエストの設定中に何かが発生しました
        console.error("エラー:", error.message);
      }
      console.error("設定:", error.config);
    });

//   .catch((e) => console.error(e))//console.error()でエラーメッセージをコンソールに出す
// }
