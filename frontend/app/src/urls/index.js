// サーバーサイドで定義したURL文字列を返す定数
const DEFAULT_API_LOCALHOST = "http://localhost:3001/api/v1";

// コミュニティ一覧
export const communitiesIndex = `${DEFAULT_API_LOCALHOST}/communities`;
// コミュニティ詳細
export const communitiesShow = (communityId) =>
  `${DEFAULT_API_LOCALHOST}/communities/${communityId}`;
// コミュニティを作成
export const communitiesCreate = `${DEFAULT_API_LOCALHOST}/communities`;

// プレイリスト一覧
export const playlistsIndex = (communityId) =>
  `${DEFAULT_API_LOCALHOST}/communities/${communityId}/playlists`;

// コミュニティへ参加
export const membershipsCreate = (communityId) =>
  `${DEFAULT_API_LOCALHOST}/communities/${communityId}/memberships`;
// コミュニティから脱退
export const membershipsDestroy = (communityId) =>
  `${DEFAULT_API_LOCALHOST}/communities/${communityId}/memberships`;

// spotifyユーザーをデータベースへ登録
export const usersCreate = `${DEFAULT_API_LOCALHOST}/users`;
// ユーザーを削除
export const usersDestroy = (userId) =>
  `${DEFAULT_API_LOCALHOST}/users/${userId}`;
// ユーザー情報の取得
export const usersShow = (userId) => `${DEFAULT_API_LOCALHOST}/users/${userId}`;

// ユーザーのログイン
export const sessionsCreate = `${DEFAULT_API_LOCALHOST}/sessions`;
// ユーザーのログアウト
export const sessionsDestroy = `${DEFAULT_API_LOCALHOST}/sessions`;
// セッションに対応したユーザー情報の取得
export const currentUser = `${DEFAULT_API_LOCALHOST}/sessions`;
// ゲストログイン
export const sessionsGuestLogin = `${DEFAULT_API_LOCALHOST}/sessions/guest`;

// ユーザーのチェック楽曲を取得
export const checksIndex = (userId) =>
  `${DEFAULT_API_LOCALHOST}/users/${userId}/checks`;
