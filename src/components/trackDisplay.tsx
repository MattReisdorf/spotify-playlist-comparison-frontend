import { Card, Divider, Flex, Typography } from "antd";
import React from "react";
import { PlaylistResponse } from "../types/playlistData";
import "../App.css";

const TrackDisplay = ({
  playlistData,
}: {
  playlistData: PlaylistResponse | null;
}) => {
  // console.log(playlistData);

  if (playlistData != null) {
    return (
      <Flex
        vertical
        style={{
          width: "95%",
        }}
      >
        {playlistData?.tracks.map((item, index) => {
          const track = item.track;
          const albumImage = track.album.images[0]?.url;

          return (
            <Card
              key={track.id || index}
              style={{
                backgroundColor: "rgb(15, 15, 15)",
                border: "none",
                color: "white",
                marginTop: 8,
                overflow: "hidden",
              }}
            >
              <Flex justify="flex-start" gap="middle">
                {albumImage && (
                  <div className="image-container">
                    <a href={track.external_urls.spotify} target="_blank">
                      <img
                        className="base-image"
                        src={albumImage}
                        alt={track.album.name}
                      />
                      <img
                        className="hover-image"
                        src="Spotify_Primary_Logo_RGB_Green.png"
                      />
                    </a>
                  </div>
                )}

                <Flex vertical justify="flex-start" align="flex-start" style = {{marginLeft: 8}}>
                  <Typography.Title
                    level={4}
                    style={{
                      marginTop: 2,
                      marginBottom: 2,
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
                      marginTop: 2,
                      marginBottom: 2,
                      color: "white",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {track.album.name}
                  </Typography.Title>
                  <Typography.Text
                    style={{
                      color: "white",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {track.artists[0].name}
                  </Typography.Text>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Flex>
    );
  }

  return null;
};

export default TrackDisplay;
