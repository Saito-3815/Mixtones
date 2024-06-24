import { atom } from "jotai";

const userAtom = atom(null);

// ユーザーがログインしているかどうかを判定するためのatom
const isLoggedInAtom = atom((get) => get(userAtom) !== null);

// ログインユーザー情報をセットする関数
const loginUser = (setUser, user) => {
  setUser(user); // ユーザー情報でuserAtomを更新
};
// ログアウト処理を行う関数
const logoutUser = (setUser) => {
  setUser(null); // userAtomをnullに設定してログアウト状態にする
};

export { userAtom, isLoggedInAtom, loginUser, logoutUser };
