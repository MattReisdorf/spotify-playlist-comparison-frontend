import { Card, Flex, Layout, Typography } from "antd";
import React from "react";
import { PlaylistResponse, TracksData } from "../types/playlistData";
import "../App.css";
import { Content, Header } from "antd/es/layout/layout";

type FilterMode = "none" | "playlist1" | "playlist2";

const TrackDisplay = ({
  playlistData,
  matchMap,
  loading,
  name,
  filterMode,
}: {
  playlistData: PlaylistResponse | null;
  matchMap: Record<string, "match" | "unique">;
  loading: boolean;
  name: string;
  filterMode: FilterMode;
}) => {
  console.log(playlistData);

  const getTrackKey = (item: TracksData): string => {
    const name = item.track.name;
    const artist = item.track.artists[0].name;
    return `${name}::${artist}`;
  };

  if (!playlistData) return null;

  const sortedTracks = [...playlistData.tracks].sort((a, b) => {
    const aArtist = a.track.artists[0]?.name.toLowerCase() || "";
    const bArtist = b.track.artists[0]?.name.toLowerCase() || "";

    const artistCompare = aArtist.localeCompare(bArtist);
    if (artistCompare !== 0) return artistCompare;

    const aName = a.track.name.toLowerCase().trim();
    const bName = b.track.name.toLowerCase().trim();

    return aName.localeCompare(bName);
  });

  console.log(filterMode);

  return (
    <Flex vertical>
      <Layout
        style={{
          backgroundColor: "rgb(15, 15, 15)",
        }}
      >
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgb(15, 15, 15)",
            border: "1px solid rgb(31, 31, 31)",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography.Title
            level={5}
            style={{
              color: "white",
              margin: 0,
            }}
          >
            {playlistData.name}
          </Typography.Title>
        </Header>
        <Content>
          {sortedTracks.map((item, index) => {
            const track = item.track;
            const albumImage = track.album.images[0]?.url;

            const matchKey = getTrackKey(item);

            if (filterMode != name) {
              return (
                <Card
                  key={track.id || index || matchKey}
                  style={{
                    backgroundColor: "rgb(15, 15, 15)",
                    border: matchMap[matchKey]
                      ? `1px ${
                          matchMap[matchKey] === "match"
                            ? "solid transparent"
                            : "dashed red"
                        }`
                      : "1px solid transparent",
                    color: "white",
                    overflow: "hidden",
                    margin: 8,
                  }}
                >
                  <Flex gap="middle">
                    {albumImage && (
                      <div className="image-container">
                        <a
                          href={track.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            className="base-image"
                            src={albumImage}
                            alt={track.album.name}
                          />
                          <img
                            className="hover-image"
                            src="Spotify_Primary_Logo_RGB_Green.png"
                            alt="Spotify Primary Logo"
                          />
                        </a>
                      </div>
                    )}

                    <Flex
                      vertical
                      style={{
                        marginLeft: 8,
                      }}
                    >
                      <Typography.Title
                        level={3}
                        style={{
                          margin: 0,
                          color: "white",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {track.name}
                      </Typography.Title>
                      <Typography.Title
                        level={5}
                        style={{
                          marginTop: 4,
                          marginBottom: 8,
                          color: "white",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </Typography.Title>
                      <Typography.Text
                        style={{
                          color: "white",
                          marginTop: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {track.album.name}
                      </Typography.Text>
                    </Flex>
                  </Flex>
                </Card>
              );
            }

            return (
              <Card
                key={track.id || index || matchKey}
                style={{
                  display: matchMap[matchKey] === "unique" ? "inherit" : "none",
                  backgroundColor: "rgb(15, 15, 15)",
                  border: matchMap[matchKey]
                    ? `1px ${
                        matchMap[matchKey] === "match"
                          ? "solid transparent"
                          : "dashed red"
                      }`
                    : "1px solid transparent",
                  color: "white",
                  overflow: "hidden",
                  margin: 8,
                }}
              >
                <Flex gap="middle">
                  {albumImage && (
                    <div className="image-container">
                      <a
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="base-image"
                          src={albumImage}
                          alt={track.album.name}
                        />
                        <img
                          className="hover-image"
                          src="Spotify_Primary_Logo_RGB_Green.png"
                          alt="Spotify Primary Logo"
                        />
                      </a>
                    </div>
                  )}

                  <Flex
                    vertical
                    style={{
                      marginLeft: 8,
                    }}
                  >
                    <Typography.Title
                      level={3}
                      style={{
                        margin: 0,
                        color: "white",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {track.name}
                    </Typography.Title>
                    <Typography.Title
                      level={5}
                      style={{
                        marginTop: 4,
                        marginBottom: 8,
                        color: "white",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </Typography.Title>
                    <Typography.Text
                      style={{
                        color: "white",
                        marginTop: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {track.album.name}
                    </Typography.Text>
                  </Flex>
                </Flex>
              </Card>
            );
          })}
        </Content>
      </Layout>
    </Flex>
  );
};

export default TrackDisplay;
