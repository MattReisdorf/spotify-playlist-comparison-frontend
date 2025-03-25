import React, { useMemo, useRef } from "react";
import { Form, Input } from "antd";
import * as lodash from "lodash";
import axios from "axios";

const DebouncedForm = () => {
  const [form] = Form.useForm();

  const abortControllerRef = useRef<AbortController | null>(null);

  const debounceValidateAPI = useMemo(() => {
    return lodash.debounce(
      async (playlist: string, resolve: Function, reject: Function) => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
          const response = await axios.get(
            `http://localhost:8080/api/playlist?playlist=${playlist}`,
            {
              withCredentials: true,
              signal: controller.signal,
            }
          );

          console.log(response);

          if (response.data.id) {
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
  }, []);

  const validatePlaylist = (_: any, playlist: string) => {
    if (!playlist) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      debounceValidateAPI(playlist, resolve, reject);
    });
  };

  return (
    <Form form={form}>
      <Form.Item
        name="playlist"
        label="Playlist"
        rules={[
          {
            validator: validatePlaylist,
          },
        ]}
        validateTrigger="onChange"
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default DebouncedForm;