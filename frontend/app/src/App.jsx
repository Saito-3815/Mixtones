// import { useState } from "react";
// import "./App.css";
// import './styles.css';
// import Login from "@/containers/Login";
// import LoggedIn from "@/containers/LoggedIn";
// import { getTokenFromUrl } from "./urls/Spotify";
import { Header } from "@/components/ui/Header/Header";
import { WordFooter } from "@/components/ui/WordFooter/WordFooter";
import { TuneFooter } from "@/components/ui/TuneFooter/TuneFooter";

function App() {
  // const [token, setToken] = useState(null);

  // useEffect(() => {
  //   const hash = getTokenFromUrl();
  //   console.log(hash);
  //   window.location.hash = ""; // URLからアクセストークンの表示を削除
  //   const token = hash.access_token;

  //   if (token) {
  //     setToken(token);
  //   }
  // }, []);

  //

  const tune = {
    name: "Song Name",
    artist: "Artist Name",
    album: "Album Name",
    images: {
      small: "small-image-url",
      large: "large-image-url",
    },
    time: "00:00",
  };

  // const user = {
  //   name: "User Name",
  // };

  return (
    <div className="flex flex-col min-h-screen bg-black relative">
      <div className="fixed z-10 w-full">
        <Header />
      </div>
      <main className="flex flex-col flex-grow mb-[72px]">
        <div className="flex-grow">
          {/* {token ? <LoggedIn accessToken={token} /> : <Login />} */}
        </div>
        <div className="">
          <WordFooter />
        </div>
      </main>
      <div className="fixed bottom-0 z-10 w-full">
        {tune && <TuneFooter tune={tune} />}
      </div>
    </div>
  );
}

export default App;
