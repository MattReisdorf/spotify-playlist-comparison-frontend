import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Flex, Space, Typography } from "antd";
import MainContainer from "./components/mainContainer";
import { UserData } from "./types/userData";
import "./App.css";

const App = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:8080/login";
  };

  const [userData, setUserData] = useState<UserData>();
  const [userDataLoading, setUserDataLoading] = useState<boolean>(false);

  useEffect(() => {
    setUserDataLoading(true);
    axios
      .get("http://localhost:8080/api/user", { withCredentials: true })
      .then((response) => {
        setUserData(response.data);
        setUserDataLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
        setUserDataLoading(false);
      });
  }, []);

  if (userDataLoading) {
    return <div></div>;
  }

  if (userData) {
    return (
      <Flex vertical style={{ height: "100vh", overflow: "hidden" }}>
        {/* <Flex style={{ flex: 1, overflow: "hidden" }}> */}
        <MainContainer userData={userData} />
        {/* </Flex> */}

        {/* Keeping Above Commented, Just In Case It's Needed Later */}
      </Flex>
    );
  }

  // Still Needs Work
  return (
    <Flex vertical style={{ height: "100vh", backgroundColor: "#000" }}>
      <Flex justify="center" align="center" style={{ flex: 1 }}>
        <Space direction="vertical" size="large" align="center">
          <img
            src="Spotify_Full_Logo_RGB_Green.png"
            alt="Spotify Full Logo Green"
            style={{ width: "clamp(180px, 30vw, 356px)", height: "auto" }}
          />
          <Typography.Title level={3} style={{ color: "white" }}>
            Playlist Comparison
          </Typography.Title>
          <Typography.Paragraph style={{ color: "white" }}>
            Lorem Ipsum
          </Typography.Paragraph>
          <Button
            type="primary"
            onClick={handleLogin}
            style={{ height: 50, backgroundColor: "#1ED760" }}
          >
            <img
              src="Spotify_Primary_Logo_RGB_White.png"
              alt="Spotify Logo"
              style={{ width: "20px", marginRight: 10 }}
            />
            Sign in with Spotify
          </Button>
        </Space>
      </Flex>
    </Flex>
  );
};

export default App;
