import { atom } from "jotai";

const tuneAtom = atom(null);

// tuneAtomがnullでない場合はtrue、そうでない場合はfalseを返すatom
const isPlayingAtom = atom(
  false, // 初期状態はfalse（再生していない）
  (get, set, update) => {
    const currentState = get(isPlayingAtom);
    set(
      isPlayingAtom,
      typeof update === "function" ? update(currentState) : update,
    );
  },
);

export { tuneAtom, isPlayingAtom };
