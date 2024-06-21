import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";
import axios from "axios";
import { usersDestroy } from "@/urls/index";

export const useDestroyUser = () => {
  const [user] = useAtom(userAtom);

  const destroyUser = async (options = {}) => {
    const userId = user.id;
    const url = usersDestroy(userId);
    return await axios.delete(url, { withCredentials: true, ...options });
  };

  return destroyUser;
};
