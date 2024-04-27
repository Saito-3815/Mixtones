import React, { Fragment, useEffect } from "react";

import { fetchUser } from '../apis/users'; 


// function LoggedIn(accessToken) {
  
//   useEffect(() => {
//     fetchUser(accessToken)
//     .then((data) =>
//     console.log(data)
//   )
// }, [])

function LoggedIn({ accessToken }) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUser(accessToken);
        console.log(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

return (
    
    <div>
      <h1>spotifyへログインしました</h1>
    </div>
  );
}

export default LoggedIn;
