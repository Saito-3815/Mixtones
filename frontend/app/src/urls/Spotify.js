export const  authEndpoint = "https://accounts.spotify.com/authorize";


const redirectUri = "http://localhost:3000/";

const clientId = "5b2ac842f6c044f984dbb35520a349fd";

// 対応する範囲を決める
const scopes = [
  "user-library-read",
];

// URLからアクセストークンを取得
export const getTokenFromUrl = () => {
  return window.location.hash //現在のURLのハッシュ部分
    .substring(1) //ハッシュ部分の先頭の # を取り除く
    .split('&') //& で分割して配列にする
    .reduce((initial, item) => { //上の配列の各要素を item として処理して累積値 initialを
      let parts = item.split('='); //access_token=xxxxxxを=で分割して配列化
      initial[parts[0]] = decodeURIComponent(parts[1]); //access_tokenの値部分をデコードして格納(acces_token:xxxxxx)
      return initial // 格納された値部分を累積値として返す(例 acces_token:xxxxxx, expires_in:3600)
    }, {});
}


// SpotifyのログインページのURL
export const accessUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;
