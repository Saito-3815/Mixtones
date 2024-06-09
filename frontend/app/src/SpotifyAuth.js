import axios from "axios";
import qs from "qs";

const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = "5b2ac842f6c044f984dbb35520a349fd";
export const redirectUri = "http://localhost:3000/";
// 対応する範囲を決める
export const scope = ["user-library-read", "user-read-private"];

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
  return { codeChallenge, codeVerifier }; // 追加：生成したcodeChallengeとcodeVerifierを返す
};

// URLから認証コードを取得
export const getCodeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
};

// アクセストークンのリクエストと取得
export const getAccessToken = async (code, codeVerifier) => {
  console.log("codeVerifier:", codeVerifier);

  const body = {
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
    client_secret: "6da90d9caf9d442b8ae62fe18ec2354d",
  };
  const response = await axios.post(tokenEndpoint, qs.stringify(body), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data.access_token;
};
