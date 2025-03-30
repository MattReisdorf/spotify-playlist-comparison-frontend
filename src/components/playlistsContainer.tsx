import { Flex, Form, Input, Splitter } from "antd";
import React, { useRef, useState } from "react";
import axios from "axios";
import * as lodash from "lodash";
import TrackDisplay from "./trackDisplay";
import { PlaylistResponse } from "../types/playlistData";

const PlaylistsContainer = () => {
  // Store each playlist's response separately
  const [trackData, setTrackData] = useState<Record<string, PlaylistResponse>>(
    {}
  );

  const [form] = Form.useForm();
  const abortControllerRef = useRef<Record<string, AbortController | null>>({});

  // Debounced validator factory, scoped by field name
  const getDebouncedValidator = (fieldName: string) => {
    return lodash.debounce(
      async (playlist: string, resolve: Function, reject: Function) => {
        if (abortControllerRef.current[fieldName]) {
          abortControllerRef.current[fieldName]!.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current[fieldName] = controller;

        try {
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
            reject("Invalid Playlist");
          }
        } catch (error: any) {
          if (axios.isCancel(error) || error.name === "CanceledError") {
            resolve();
          } else {
            reject("Validation Failed; Try Again");
          }
        }
      },
      500
    );
  };

  const makeValidator = (fieldName: string) => (_: any, value: string) => {
    if (!value) return Promise.resolve();

    return new Promise((resolve, reject) => {
      getDebouncedValidator(fieldName)(value, resolve, reject);
    });
  };

  return (
    <Flex vertical 
      justify="center"
      align="center"
      style={{ 
        width: "100%",
        marginTop: 20,
        marginBottom: 20
      }}>
        
      <Splitter 
        onResize={(sizes) => console.log(sizes)}
        style={{ 
          width: "97%"
        }}>
        <Splitter.Panel 
          style = {{
            backgroundColor: 'rgb(15, 15, 15)',
            borderRadius: 8
          }}
          min={147}
        >
          <Form form={form}>
            <Form.Item
              name="playlist1"
              layout="vertical"
              rules={[{ validator: makeValidator("playlist1") }]}
              validateTrigger="onChange"
              style={{ marginTop: 20, marginBottom: 50 }}
            >
              <Flex
                justify="center"
                align="center"
                style={{
                  width: "100%",
                }}
              >
                <Input
                  placeholder="Playlist 1 URL"
                  style={{
                    width: "95%",
                  }}
                />
              </Flex>
            </Form.Item>
          </Form>

          {trackData ? (
            <Flex justify="center" align="center">
              <TrackDisplay playlistData={trackData.playlist1} />
            </Flex>
          ) : null}
        </Splitter.Panel>

        <Splitter.Panel 
        style = {{
          backgroundColor: 'rgb(15, 15, 15)',
          borderRadius: 8
        }}
        min={147}
        >
          <Form form={form}>
            <Form.Item
              name="playlist2"
              layout="vertical"
              rules={[{ validator: makeValidator("playlist2") }]}
              validateTrigger="onChange"
              style={{ marginTop: 20, marginBottom: 50 }}
            >
              <Flex
                justify="center"
                align="center"
                style={{
                  width: "100%",
                }}
              >
                <Input
                  placeholder="Playlist 2 URL"
                  style={{
                    width: "95%",
                  }}
                />
              </Flex>
            </Form.Item>
          </Form>

          {trackData ? (
            <Flex justify="center" align="center">
              <TrackDisplay playlistData={trackData.playlist2} />
            </Flex>
          ) : null}
        </Splitter.Panel>
      </Splitter>
    </Flex>
  );
};

export default PlaylistsContainer;
