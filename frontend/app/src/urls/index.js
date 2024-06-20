// サーバーサイドで定義したURL文字列を返す定数
const DEFAULT_API_LOCALHOST = "http://localhost:3001/api/v1";

// コミュニティ一覧
export const communitiesIndex = `${DEFAULT_API_LOCALHOST}/communities`;

// spotifyユーザーをデータベースへ登録
export const usersCreate = `${DEFAULT_API_LOCALHOST}/users`;

// ユーザーのログイン
export const sessionsCreate = `${DEFAULT_API_LOCALHOST}/sessions`;
// ユーザーのログアウト
export const sessionsDestroy = `${DEFAULT_API_LOCALHOST}/sessions`;
// セッションに対応したユーザー情報の取得
export const currentUser = `${DEFAULT_API_LOCALHOST}/sessions`;
// ゲストログイン
export const sessionsGuestLogin = `${DEFAULT_API_LOCALHOST}/sessions/guest`;
