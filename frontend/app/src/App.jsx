import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "@/components/ui/Header/Header";
import { WordFooter } from "@/components/ui/WordFooter/WordFooter";
import { TuneFooter } from "@/components/ui/TuneFooter/TuneFooter";
import Top from "./containers/Top";
import Signup from "./containers/Signup";
import Community from "./containers/Community";
import CommunityEdit from "./containers/CommunityEdit";
import Login from "./containers/Login";
import User from "./containers/User";
import UserEdit from "./containers/UserEdit";
import { useCheckSession } from "./hooks/useCheckSession";
import { useAtom } from "jotai";
import { tuneAtom } from "./atoms/tuneAtom";
import PrivacyPolicy from "./containers/PrivacyPolicy";

function App() {
  // セッションをチェックしてユーザー情報を取得
  useCheckSession();

  if (import.meta.env.MODE === "production") {
    console.log = function () {};
  }

  const [tune] = useAtom(tuneAtom);

  return (
    <Router>
      <div className="flex flex-col min-h-screen w-screen min-w-screen bg-black relative overflow-hidden">
        <div className="fixed z-10 w-full">
          <Header user={""} />
        </div>
        <main className="flex flex-col flex-grow mb-[72px] mt-16 w-full">
          <Routes>
            {/* コミュニティ一覧 */}
            <Route path="/" element={<Top />} />
            {/* サインアップ */}
            <Route path="/signup" element={<Signup />} />
            {/* ログイン */}
            <Route path="/login" element={<Login />} />
            {/* コミュニティ情報 */}
            <Route
              path="/communities/:communityId"
              element={<Community user={""} />}
            />
            {/* コミュニティ編集 */}
            <Route
              path="/communities/:communityId/edit"
              element={<CommunityEdit />}
            />
            {/* ユーザー情報 */}
            <Route path="/users/:userId" element={<User />} />
            {/* ユーザー編集 */}
            <Route path="/users/:userId/edit" element={<UserEdit />} />
            {/* プライバシーポリシー */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            {/* 利用規約 */}
          </Routes>
          <div className="px-16">
            <WordFooter />
          </div>
        </main>
        <div className="fixed bottom-0 z-10 w-full">
          {tune && <TuneFooter />}
        </div>
      </div>
    </Router>
  );
}

export default App;
