import { Flex, Form, Input, message, Splitter } from "antd";
import React, { useEffect, useRef, useState } from "react";
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
  // const [loading, setLoading] = useState<boolean>(false);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({
    playlist1: false,
    playlist2: false,
  });
  const [form] = Form.useForm();
  const abortControllerRef = useRef<Record<string, AbortController | null>>({});

  const debouncedValidators = useRef<
    Record<string, ReturnType<typeof lodash.debounce>>
  >({});

  const [messageApi, contextHolder] = message.useMessage();

  // const getDebouncedValidator = (fieldName: string) => {
  //   if (!debouncedValidators.current[fieldName]) {
  //     debouncedValidators.current[fieldName] = lodash.debounce(
  //       async (playlist: string, resolve: Function, reject: Function) => {
  //         if (abortControllerRef.current[fieldName]) {
  //           abortControllerRef.current[fieldName]!.abort();
  //         }

  //         const controller = new AbortController();
  //         abortControllerRef.current[fieldName] = controller;

  //         try {
  //           setLoading(true);
  //           const response = await axios.get(
  //             `http://localhost:8080/api/playlist?playlist=${playlist}`,
  //             {
  //               withCredentials: true,
  //               signal: controller.signal,
  //             }
  //           );

  //           if (response.data.id) {
  //             setTrackData((prev) => ({
  //               ...prev,
  //               [fieldName]: response.data,
  //             }));
  //             resolve();
  //           } else {
  //             reject();
  //           }
  //         } catch (error: any) {
  //           if (axios.isCancel(error) || error.name === "CanceledError") {
  //             resolve();
  //           } else {
  //             console.error(error.response?.data || error.message);
  //             messageApi.open({
  //               type: "error",
  //               content: error.response?.data || "Something Went Wrong",
  //             });
  //             reject();
  //           }
  //         } finally {
  //           setLoading(false);
  //         }
  //       },
  //       500
  //     );
  //   }

  //   return debouncedValidators.current[fieldName];
  // };

  const getDebouncedValidator = (fieldName: string) => {
    if (!debouncedValidators.current[fieldName]) {
      debouncedValidators.current[fieldName] = lodash.debounce(
        async (playlist: string, resolve: Function, reject: Function) => {
          if (abortControllerRef.current[fieldName]) {
            abortControllerRef.current[fieldName]!.abort();
          }
  
          const controller = new AbortController();
          abortControllerRef.current[fieldName] = controller;
  
          try {
            setLoadingMap((prev) => ({ ...prev, [fieldName]: true }));
  
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
            } else {
              reject();
            }
          } catch (error: any) {
            if (axios.isCancel(error) || error.name === "CanceledError") {
              resolve();
            } else {
              console.error(error.response);
              messageApi.open({
                type: "error",
                content: error.response?.data || "Something Went Wrong",
                duration: 5,
                className: 'custom-class',
                style: {
                  marginTop: '74px',
                }
              });
              reject();
            }
          } finally {
            setLoadingMap((prev) => ({ ...prev, [fieldName]: false }));
          }
        },
        500
      );
    }
  
    return debouncedValidators.current[fieldName];
  };

  console.log(loadingMap);
  

  const makeValidator = (fieldName: string) => (_: any, value: string) => {
    if (!value) return Promise.resolve();
    return new Promise((resolve, reject) =>
      getDebouncedValidator(fieldName)(value, resolve, reject)
    );
  };

  useEffect(() => {
    return () => {
      Object.values(debouncedValidators.current).forEach((debounceFn) =>
        debounceFn.cancel()
      );
    };
  }, []);

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
    <>
      {contextHolder}
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
              help=""
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
              loading={loadingMap["playlist1"]}
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
              help=""
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
              loading={loadingMap["playlist2"]}
              name="playlist2"
            />
          </div>
        </Splitter.Panel>
      </Splitter>
    </>
  );
};

export default PlaylistsContainer;
