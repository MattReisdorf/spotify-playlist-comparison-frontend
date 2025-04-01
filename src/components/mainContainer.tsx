import React from "react";
import { UserData } from "../types/userData";
import { Flex } from "antd";
import PlaylistsContainer from "./playlistsContainer";

const MainContainer = ({ userData }: { userData: UserData }) => {
  return (
    <Flex vertical style={{ flex: 1, width: "100%", overflow: "hidden" }}>
      <Flex
        justify="space-between"
        align="center"
        gap="middle"
        style={{
          padding: 16,
        }}
      >
        <img
          src="Spotify_Primary_Logo_RGB_Green.png"
          alt="Spotify Primary Logo"
          style={{
            height: 50,
            width: 50,
          }}
        />

        <img
          src={userData.images[0].url}
          alt={`${userData.country} Profile`}
          style={{ height: 50, width: 50, borderRadius: "50%" }}
        />
      </Flex>

      <Flex
        justify="center"
        align="center"
        style={{
          flex: 1,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <PlaylistsContainer />
      </Flex>
    </Flex>
  );
};

export default MainContainer;
