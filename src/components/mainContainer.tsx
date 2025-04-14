import React, { useEffect, useState } from "react";
import { UserData } from "../types/userData";
import { Flex, Radio } from "antd";
import PlaylistsContainer from "./playlistsContainer";

const MainContainer = ({ userData }: { userData: UserData }) => {
  type FilterMode = "none" | "playlist1" | "playlist2";

  const [filterMode, setFilterMode] = useState<FilterMode>("none");

  return (
    <Flex vertical style={{ flex: 1, width: "100%", overflow: "hidden" }}>
      <Flex
        vertical
        style={{
          flex: 1,
          overflow: "hidden",
          paddingBottom: 16,
        }}
      >
        <Flex
          justify="space-between"
          align="center"
          style={{
            padding: 16,
            gap: 16,
          }}
        >
          <img
            src="Spotify_Primary_Logo_RGB_Green.png"
            alt="Spotify Primary Logo"
            style={{ height: 50, width: 50 }}
          />
          <Radio.Group
            className="radio-group"
            buttonStyle="solid"
            defaultValue="none"
          >
            <Radio.Button
              className="radio-button"
              value="playlist1"
              onClick={() => setFilterMode("playlist1")}
            >
              Filter Left
            </Radio.Button>

            <Radio.Button
              className="radio-button"
              value="none"
              onClick={() => setFilterMode("none")}
            >
              No Filter
            </Radio.Button>

            <Radio.Button
              className="radio-button"
              value="playlist2"
              onClick={() => setFilterMode("playlist2")}
            >
              Filter Right
            </Radio.Button>
          </Radio.Group>

          <img
            src={userData.images[0].url}
            alt={`${userData.display_name} Profile`}
            style={{ height: 50, width: 50, borderRadius: "50%" }}
          />
        </Flex>

        <Flex style={{ flex: 1, overflow: "hidden" }}>
          <PlaylistsContainer filterMode={filterMode} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MainContainer;
