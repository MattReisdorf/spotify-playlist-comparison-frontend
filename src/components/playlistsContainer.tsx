import { Flex, Form, Input, Splitter } from "antd";
import React, { useRef, useState } from "react";
import axios from "axios";
import * as lodash from "lodash";
import TrackDisplay from "./trackDisplay";
import { PlaylistResponse, TracksData } from "../types/playlistData";

import "../App.css";

type FilterMode = "none" | "playlist1" | "playlist2";

const PlaylistsContainer = ({ filterMode }: { filterMode: FilterMode }) => {
  const [trackData, setTrackData] = useState<Record<string, PlaylistResponse>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [form] = Form.useForm();
  const abortControllerRef = useRef<Record<string, AbortController | null>>({});

  const getDebouncedValidator = (fieldName: string) => {
    return lodash.debounce(
      async (playlist: string, resolve: Function, reject: Function) => {
        if (abortControllerRef.current[fieldName]) {
          abortControllerRef.current[fieldName]!.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current[fieldName] = controller;

        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:8080/api/playlist?playlist=${playlist}`,
            {
              withCredentials: true,
              signal: controller.signal,
            }
          );

          if (response.data.id) {
            setTrackData((prev) => ({
              ...prev,
              [fieldName]: response.data,
            }));
            resolve();
            setLoading(false);
          } else {
            console.log("Non error Rejection:", response);
            reject();
            setLoading(false);
          }
        } catch (error: any) {
          if (axios.isCancel(error) || error.name === "CanceledError") {
            resolve();
            setLoading(false);
          } else {
            console.error(error.response);
            reject("Validation Failed; Try Again");
            setLoading(false);
          }
        }
      },
      500
    );
  };

  const makeValidator = (fieldName: string) => (_: any, value: string) => {
    if (!value) return Promise.resolve();
    return new Promise((resolve, reject) =>
      getDebouncedValidator(fieldName)(value, resolve, reject)
    );
  };

  const getTrackKey = (item: TracksData): string => {
    const name = item.track.name;
    const artist = item.track.artists[0].name;
    return `${name}::${artist}`;
  };

  const getTrackKeySet = (playlist?: PlaylistResponse) => {
    return new Set((playlist?.tracks || []).map((item) => getTrackKey(item)));
  };

  const playlist1 = trackData.playlist1;
  const playlist2 = trackData.playlist2;

  const getMatchMap = (
    playlist: PlaylistResponse | undefined,
    otherSet: Set<string>
  ) => {
    if (!playlist) return {};
    return playlist.tracks.reduce((acc, item) => {
      const key = getTrackKey(item);
      acc[key] = otherSet.has(key) ? "match" : "unique";
      return acc;
    }, {} as Record<string, "match" | "unique">);
  };

  let matchMap1: Record<string, "match" | "unique"> = {};
  let matchMap2: Record<string, "match" | "unique"> = {};

  if (playlist1 && playlist2) {
    const playlist1Keys = getTrackKeySet(playlist1);
    const playlist2Keys = getTrackKeySet(playlist2);

    matchMap1 = getMatchMap(playlist1, playlist2Keys);
    matchMap2 = getMatchMap(playlist2, playlist1Keys);
  }

  return (
    <Splitter
      style={{
        paddingLeft: 16,
        paddingRight: 16,
        height: "100%",
      }}
    >
      <Splitter.Panel
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "100%",
        }}
        min={159}
      >
        <Form form={form}>
          <Form.Item
            name="playlist1"
            layout="vertical"
            rules={[{ validator: makeValidator("playlist1") }]}
            validateTrigger="onChange"
            style={{ paddingTop: 14, paddingBottom: 20 }}
            // Need to keep div as helper to keep spacing consistent
            help={<div></div>}
          >
            <Flex justify="center">
              <Input
                placeholder="Playlist URL / ID"
                style={{
                  width: 240,
                  textAlign: "center",
                }}
              ></Input>
            </Flex>
          </Form.Item>
        </Form>

        <div
          className="Tracks-Container"
          style={{
            flex: 1,
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            backgroundColor: "rgb(15, 15, 15)",
            borderRadius: 8,
          }}
        >
          <TrackDisplay
            filterMode={filterMode}
            playlistData={playlist1}
            matchMap={matchMap1}
            loading={loading}
            name="playlist1"
          />
        </div>
      </Splitter.Panel>

      <Splitter.Panel
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "100%",
        }}
        min={159}
      >
        <Form form={form}>
          <Form.Item
            name="playlist2"
            layout="vertical"
            rules={[{ validator: makeValidator("playlist2") }]}
            validateTrigger="onChange"
            style={{ paddingTop: 14, paddingBottom: 20 }}
          >
            <Flex justify="center">
              <Input
                placeholder="Playlist URL / ID"
                style={{
                  width: 240,
                  textAlign: "center",
                }}
              />
            </Flex>
          </Form.Item>
        </Form>

        <div
          className="Tracks-Container"
          style={{
            flex: 1,
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            backgroundColor: "rgb(15, 15, 15)",
            borderRadius: 8,
          }}
        >
          <TrackDisplay
            filterMode={filterMode}
            playlistData={playlist2}
            matchMap={matchMap2}
            loading={loading}
            name="playlist2"
          />
        </div>
      </Splitter.Panel>
    </Splitter>
  );
};

export default PlaylistsContainer;
