import React from "react";
import { accessUrl } from "../urls/Spotify";
import { Button } from "@/components/ui/button/button";

function Login() {
  return (
    <div>
      <h2 className="text-3xl text-red-600">ログイン前です</h2>
      <Button>
        <a href={accessUrl}>spotifyログインします</a>
      </Button>
    </div>
  );
}

export default Login;
