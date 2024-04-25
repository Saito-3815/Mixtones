import React,{ useState, useEffect } from 'react';
import './App.css';
import Login from './containers/Login';
import LoggedIn from './containers/LoggedIn';
import { getTokenFromUrl } from './urls/Spotify';



function App() {

  const [token, setToken] = useState(null);

  useEffect(() => {
    const hash = getTokenFromUrl();
    console.log(hash )
    window.location.hash = ""; //URLからアクセストークンの表示を削除
    const token = hash.access_token;

    if (token) {
      setToken(token)
    }

  }, [])

  return (
    // <div className="App">
    //   <Login/>
    // </div>

<div className="App">
{ token ? <LoggedIn/> : <Login/> } 
</div> 
  );
}

export default App;