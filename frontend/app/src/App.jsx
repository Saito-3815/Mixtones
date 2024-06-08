import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
// import { useEffect } from "react";
// import { getTokenFromUrl } from "./urls/Spotify";

function App() {
  const queryClient = new QueryClient();

  const tune = {
    name: "Song Name",
    artist: "Artist Name",
    album: "Album Name",
    images: {
      small: "https://picsum.photos/200",
      large: "https://picsum.photos/500",
    },
    time: "00:00",
  };

  // useEffect(() => {
  //   if (error) {
  //     return <div>Error</div>;
  //   }
  // }, [error]);

  return (
    <QueryClientProvider client={queryClient}>
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
                path="/communities/:communitiesId"
                element={<Community user={""} />}
              />
              {/* コミュニティ編集 */}
              <Route
                path="/communities/:communitiesId/edit"
                element={<CommunityEdit />}
              />
              {/* ユーザー情報 */}
              <Route path="/users/:usersId" element={<User />} />
              {/* ユーザー編集 */}
              <Route path="/users/:usersId/edit" element={<UserEdit />} />
            </Routes>
            <div className="px-16">
              <WordFooter />
            </div>
          </main>
          <div className="fixed bottom-0 z-10 w-full">
            {tune && <TuneFooter tune={tune} />}
          </div>
        </div>
      </Router>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
