import React from 'react'
import { accessUrl } from "../urls/Spotify";

function Login() {
  return (
    <div className="Login">
      <h2>ログイン前です</h2>
      <a href={accessUrl}>spotifyへログイン</a>
    </div>
  )
}

export default Login