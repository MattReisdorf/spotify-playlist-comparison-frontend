import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/login";
  }

  const playlistUrl = "https://open.spotify.com/playlist/7pkWzBYeI8UpeKMfpGjgKD?si=ae044ff94d3f4fbb"
  const playlistId = "ae044ff94d3f4fbb"
  
  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    axios.get("http://localhost:8080/api/user", {withCredentials: true})
      .then(response => {
        setUserData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error fetching user data", error);
      });
  }, []);

  

  if (userData) {
    return (
      <div>
      {/* {userData ? <p>{JSON.stringify(userData, null, 2)}</p> : <p>Loading user data...</p>}     */}
      </div>
    )
  } else {
    return (
      <button onClick = {handleLogin}>Login</button>
    )
  }
}

export default App;
