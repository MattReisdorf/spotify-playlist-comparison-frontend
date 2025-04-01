interface PlaylistResponse {
  id: string;
  total: number;
  tracks: TracksData[];
}

interface TracksData {
  added_at: string;
  added_by: AddedBy;
  is_local: boolean;
  primary_color: string | null;
  track: Track;
  video_thumbnail: VideoThumbnail;
}

interface VideoThumbnail {
  url: string | null;
}

interface AddedBy {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

interface ExternalUrls {
  spotify: string;
}

interface Track {
  album: Album;
  artists: Artists[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
}

interface ExternalIds {
  isrc: string;
}

interface Album {
  album_type: string;
  artists: Artists[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Images[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface Images {
  height: number;
  url: string;
  width: number;
}

interface Artists {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export type {PlaylistResponse, TracksData};