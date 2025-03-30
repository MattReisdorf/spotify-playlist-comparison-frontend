import React from "react";
import { UserData } from "../types/userData";
import { Flex, Typography } from "antd";
import PlaylistsContainer from "./playlistsContainer";

const MainContainer = ({ userData }: { userData: UserData }) => {
  return (
    <Flex
      className="main-container-container"
      vertical
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <Flex
        className="user-data-container"
        gap="middle"
        justify="center"
        align="center"
        style={{
          width: "100%",
        }}
      >
        <img
          src={userData.images[0].url}
          style={{
            height: 50,
            width: 50,
            borderRadius: 100,
          }}
        />
        <Typography.Title
          level={3}
          style={{
            color: "white",
            margin: 0,
          }}
        >
          {userData.display_name}
        </Typography.Title>
      </Flex>

      <Flex
        style={{
          flex: 1,
        }}
      >
        <PlaylistsContainer />
      </Flex>
    </Flex>
  );
};

export default MainContainer;
