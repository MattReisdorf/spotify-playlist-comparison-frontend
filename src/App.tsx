import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

// User Data response interface
interface UserData {
  country: string,
  display_name: string,
  email: string,
  explicit_content: ExplicitContent,
  external_urls: ExternalUrls,
  followers: Followers,
  href: string,
  id: string,
  images: Images[],
  product: string,
  type: string,
  uri: string
}

interface ExplicitContent {
  filter_enabled: boolean,
  filter_locked: boolean
}

interface ExternalUrls {
  spotify: string
}

interface Followers {
  href: string | null,
  total: number
}

interface Images {
  height: number,
  url: string,
  width: number
}

function App() {

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/login";
  }

  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    axios.get("http://localhost:8080/api/user", {withCredentials: true})
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error("Error fetching user data", error);
      });
  }, []);

  if (userData) {
    console.log(userData);
    return (
      <div>
      <p>{userData.display_name}</p>
      <img src = {userData.images[0].url} />
      </div>
    )
  } 
  else {
    return (
      <button onClick = {handleLogin}>Login</button>
    )
  }
}

export default App;
