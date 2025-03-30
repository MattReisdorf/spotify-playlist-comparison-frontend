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

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user", { withCredentials: true })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
      });
  }, []);

  if (userData) {
    return (
      <Flex
        className="body-container"
        vertical
        style={{
          height: "100vh",
        }}
      >
        <Flex
          justify="center"
          align="center"
          style={{
            height: "clamp(80px, 13vw, 150px)",
          }}
        >
          <img
            src="Spotify_Full_Logo_RGB_Green.png"
            alt="Spotify Full Logo Green"
            style={{
              height: "auto",
              width: "clamp(180px, 30vw, 356px)",
            }}
          />
        </Flex>

        <Flex
          style={{
            flex: 1,
          }}
        >
          <MainContainer userData={userData} />
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Space
        direction="vertical"
        size="small"
        style={{
          display: "flex",
        }}
      >
        <Flex>
          <Flex
            style={{
              width: "100%",
              height: "clamp(80px, 13vw, 150px",
            }}
            justify="center"
            align="center"
          >
            <img
              src="Spotify_Full_Logo_RGB_Green.png"
              alt="Spotify Full Logo Green"
              style={{
                height: "auto",
                width: "clamp(180px, 30vw, 356px)",
              }}
            />
          </Flex>
        </Flex>

        <Flex>
          <Flex
            style={{
              width: "100%",
              height: "auto",
            }}
            justify="center"
            align="center"
          >
            <Space direction="vertical" size="middle">
              <Flex
                style={{
                  width: "100%",
                  height: "auto",
                }}
                justify="center"
                align="center"
              >
                <Typography.Title
                  level={3}
                  style={{ color: "rgb(255, 255, 255)" }}
                >
                  Playlist Comparison
                </Typography.Title>
              </Flex>
              <Flex
                style={{
                  width: "100%",
                  height: "auto",
                }}
                justify="center"
                align="center"
              >
                <Typography.Paragraph style={{ color: "rgb(255, 255, 255)" }}>
                  Lorem Ipsum
                </Typography.Paragraph>
              </Flex>
            </Space>
            {/* </Flex> */}
          </Flex>
        </Flex>

        <Flex>
          <Flex
            style={{
              width: "100%",
              height: "100%",
            }}
            justify="center"
            align="center"
          >
            {/* Still Needs Some Work */}
            <Button
              type="primary"
              onClick={handleLogin}
              style={{ height: 50, width: "auto", backgroundColor: "#1ED760" }}
            >
              <img
                src="Spotify_Primary_Logo_RGB_White.png"
                alt="Spotify Primary Logo White"
                style={{
                  height: "auto",
                  width: "20px",
                }}
              />
              <p>Sign in with Spotify </p>
            </Button>
          </Flex>
        </Flex>
      </Space>
    );
  }
};

export default App;
