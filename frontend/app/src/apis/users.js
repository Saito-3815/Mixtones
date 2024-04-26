import axios from 'axios';

export const fetchUser =(accesToken) => {
  return axios.get("https://api.spotify.com/v1/me", {
    headers: { 
      Authorization: `Bearer ${accesToken}` }
    }
  )
  .then(res => {
    return res.data //返り値をresという名前で取得し、res.dataでレスポンスの中身だけをreturn
  })
  .catch((e) => console.error(e))//console.error()でエラーメッセージをコンソールに出す
}