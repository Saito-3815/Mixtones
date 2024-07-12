import axios from "axios";
import { sessionsGuestLogin } from "@/urls/index";

export const guestLogin = () => {
  // axios.postの第二引数にデータを渡し、第三引数に設定を渡す必要があります。
  // この場合、データが不要なので空のオブジェクトを第二引数に、設定を第三引数に渡します。
  return axios.post(sessionsGuestLogin, {}, { withCredentials: true });
};
