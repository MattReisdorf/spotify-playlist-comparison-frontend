import React, { useMemo, useRef, useState } from "react";
import { Form, Input } from "antd";
import * as lodash from "lodash";
import axios from "axios";
import TrackDisplay from "./trackDisplay";


interface PlaylistResponse {
  id: string,
  total: number,
  tracks: TracksData[]
}

interface TracksData {
  added_at: string,
  added_by: AddedBy,
  is_local: boolean,
  primary_color: string | null,
  track: Track,
  video_thumbnail: VideoThumbnail
}

interface VideoThumbnail {
  url: string | null
}

interface AddedBy {
  external_urls: ExternalUrls,
  href: string,
  id: string,
  type: string,
  uri: string
}

interface ExternalUrls {
  spotify: string
}

interface Track {
  album: Album,
  artists: Artists[],
  available_markets: string[],
  disc_number: number,
  duration_ms: number,
  episode: boolean,
  explicit: boolean,
  external_ids: ExternalIds,
  external_urls: ExternalUrls,
  href: string,
  id: string,
  is_local: boolean,
  name: string,
  popularity: number,
  preview_url: string | null,
  track: boolean,
  track_number: number,
  type: string,
  uri: string
}

interface ExternalIds {
  isrc: string
}

interface Album {
  album_type: string,
  artists: Artists[],
  available_markets: string[],
  external_urls: ExternalUrls,
  href: string,
  id: string,
  images: Images[],
  name: string,
  release_date: string,
  release_date_precision: string,
  total_tracks: number,
  type: string,
  uri: string
}

interface Images {
  height: number,
  url: string,
  width: number
}

interface Artists {
  external_urls: ExternalUrls,
  href: string,
  id: string,
  name: string,
  type: string,
  uri: string
}

const DebouncedForm = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [trackData, setTrackData] = useState<PlaylistResponse | null>(null);

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
            setTrackData(response.data);
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
    <>
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
        
      {
        trackData ?
        <TrackDisplay playlistData={trackData}/>
        :
        null
      }
      
    </>
  );
};

export default DebouncedForm;