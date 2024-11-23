// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useCheckSession } from "./hooks/useCheckSession";
import { useAtom } from "jotai";
import { tuneAtom } from "./atoms/tuneAtom";
import Top from "./containers/Top";
import Signup from "./containers/Signup";
import Community from "./containers/Community";
import CommunityEdit from "./containers/CommunityEdit";
import Login from "./containers/Login";
import User from "./containers/User";
import UserEdit from "./containers/UserEdit";
import PrivacyPolicy from "./containers/PrivacyPolicy";
import Terms from "./containers/Terms";
import PassSignup from "./containers/PassSignup";
import PassLogin from "./containers/PassLogin";

function App() {
  useCheckSession();
  const [tune] = useAtom(tuneAtom);

  if ((import.meta as any).env.MODE === "production") {
    console.log = function () {};
  }

  return (
    <Router>
      <Layout tune={!!tune}>
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/passsignup" element={<PassSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/passlogin" element={<PassLogin />} />
          <Route path="/communities/:communityId" element={<Community />} />
          <Route path="/communities/:communityId/edit" element={<CommunityEdit />} />
          <Route path="/users/:userId" element={<User />} />
          <Route path="/users/:userId/edit" element={<UserEdit />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;