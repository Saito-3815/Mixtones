import crypto from "crypto";
import axios from "axios";
import qs from "qs";

export const authEndpoint = "https://accounts.spotify.com/authorize";
export const tokenEndpoint = "https://accounts.spotify.com/api/token";

const redirectUri = "http://localhost:3000/";
const clientId = "5b2ac842f6c044f984dbb35520a349fd";

// 対応する範囲を決める
const scopes = ["user-library-read", "user-read-private"];

// コードチャレンジとコードバリデータの生成
// コード検証子の作成
const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};
const codeVerifier = generateRandomString(64);

// コード チャレンジ生成
// ハッシュの作成
const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

// Base64エンコード
const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

// 上記を組み合わせてコードチャレンジを生成
// const hashed = await sha256(codeVerifier)
// const codeChallenge = base64encode(hashed);

let codeChallenge;

const generateCodeChallenge = async () => {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  codeChallenge = base64encode(hashed);
};

generateCodeChallenge();

// 認証リクエストのURL
export const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join("%20")}&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}`;

// URLから認証コードを取得
export const getCodeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
};

// アクセストークンのリクエストと取得
export const getAccessToken = async (code) => {
  const body = {
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  };
  const response = await axios.post(tokenEndpoint, qs.stringify(body), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data.access_token;
};
