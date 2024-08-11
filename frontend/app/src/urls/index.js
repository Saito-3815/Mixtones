// 環境変数から取得したURL文字列を返す定数
const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

// サーバーサイドで定義したURL文字列を返す定数
// const DEFAULT_API_LOCALHOST = "http://localhost:3001/api/v1";

// コミュニティ一覧
export const communitiesIndex = `${baseURL}/communities`;
// コミュニティ詳細
export const communitiesShow = (communityId) =>
  `${baseURL}/communities/${communityId}`;
// コミュニティを作成
export const communitiesCreate = `${baseURL}/communities`;
// コミュニティを更新
export const communitiesUpdate = (communityId) =>
  `${baseURL}/communities/${communityId}`;
// コミュニティの画像を更新
export const communitiesUpdateAvatar = (communityId) =>
  `${baseURL}/communities/${communityId}/update_avatar`;

// プレイリスト一覧
export const playlistsIndex = (communityId) =>
  `${baseURL}/communities/${communityId}/playlists`;
// レコメンドする
export const playlistsRecommend = (communityId, tuneId) =>
  `${baseURL}/communities/${communityId}/playlists/${tuneId}`;

// コミュニティへ参加
export const membershipsCreate = (communityId) =>
  `${baseURL}/communities/${communityId}/memberships`;
// コミュニティから脱退
export const membershipsDestroy = (communityId) =>
  `${baseURL}/communities/${communityId}/memberships`;

// spotifyユーザーをデータベースへ登録
export const usersCreate = `${baseURL}/users`;
// パスワードユーザーをデータベースへ登録
export const usersCreatePassword = `${baseURL}/users/password`;
// ユーザーを削除
export const usersDestroy = (userId) => `${baseURL}/users/${userId}`;
// ユーザー情報の取得
export const usersShow = (userId) => `${baseURL}/users/${userId}`;
// ユーザー情報の更新
export const usersUpdate = (userId) => `${baseURL}/users/${userId}`;
// ユーザーの画像を更新
export const usersUpdateAvatar = (userId) =>
  `${baseURL}/users/${userId}/update_avatar`;

// ユーザーのログイン
export const sessionsCreate = `${baseURL}/sessions`;
// パスワードユーザーのログイン
export const sessionsCreatePassword = `${baseURL}/sessions/password`;
// ユーザーのログアウト
export const sessionsDestroy = `${baseURL}/sessions`;
// セッションに対応したユーザー情報の取得
export const currentUser = `${baseURL}/sessions`;
// ゲストログイン
export const sessionsGuestLogin = `${baseURL}/sessions/guest`;

// ユーザーのチェック楽曲を取得
export const checksIndex = (userId) => `${baseURL}/users/${userId}/checks`;
// チェック楽曲を登録
export const checksCreate = (userId) => `${baseURL}/users/${userId}/checks`;
// チェック楽曲を削除
export const checksDestroy = (userId) => `${baseURL}/users/${userId}/checks`;

// 署名付きurlを取得
export const imagesCreate = `${baseURL}/images`;
