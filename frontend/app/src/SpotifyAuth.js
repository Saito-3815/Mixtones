const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = import.meta.env.VITE_CLIENT_ID;
export const redirectUri = import.meta.env.VITE_REDIRECT_URI;

// 対応する範囲を決める
export const scope = [
  "user-library-read",
  "user-read-private",
  "streaming",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
];

// コードチャレンジとコードバリデータの生成
// コード検証子の作成
export const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const state = encodeURIComponent(generateRandomString(16));

// SpotifyのログインページのURL
export const accessUrl = `${authEndpoint}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope.join(
  "%20",
)}&state=${state}&show_dialog=true`;

export const tokenEndpoint = "https://accounts.spotify.com/api/token";

// コード チャレンジ生成
// ハッシュの作成
export const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};
// Base64エンコード
export const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

let codeChallenge;
let codeVerifier;

export const generateCodeChallenge = async () => {
  codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  codeChallenge = base64encode(hashed);
  return { codeChallenge, codeVerifier };
};

// URLから認証コードを取得
export const getCodeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
};

// codeVerifierと認証コードとリダイレクト元情報を削除
export const removeCodeVerifierAndRedirect = () => {
  sessionStorage.removeItem("codeVerifier");
  localStorage.removeItem("codeVerifier");
  sessionStorage.removeItem("redirectFrom");
  const urlWithoutCode = new URL(window.location.href);
  urlWithoutCode.searchParams.delete("code");
  window.history.replaceState(null, "", urlWithoutCode.href);
};
