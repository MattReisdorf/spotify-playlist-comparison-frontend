import React from 'react';

interface UserData {
  country: string,
  display_name: string,
  email: string,
  explicit_content: ExplicitContent,
  external_urls: ExternalUrls,
  followers: Followers,
  href: string,
  id: string,
  images: Images[],
  product: string,
  type: string,
  uri: string
}

interface ExplicitContent {
  filter_enabled: boolean,
  filter_locked: boolean
}

interface ExternalUrls {
  spotify: string
}

interface Followers {
  href: string | null,
  total: number
}

interface Images {
  height: number,
  url: string,
  width: number
}

export default function User({ userData }: { userData: UserData }) {
  return (
    <div>
      {/* <p>{userData.country}</p>
      <p>{userData.display_name}</p>
      <p>{userData.email}</p>
      <p>{userData.explicit_content.filter_enabled}</p>
      <p>{userData.explicit_content.filter_locked}</p>
      <p>{userData.external_urls.spotify}</p>
      <p>{userData.followers.href}</p>
      <p>{userData.followers.total}</p>
      <p>{userData.href}</p>
      <p>{userData.id}</p>
      <p>{userData.images[0].height}</p>
      <p>{userData.images[0].width}</p>
      <p>{userData.images[0].url}</p>
      <p>{userData.product}</p>
      <p>{userData.type}</p>
      <p>{userData.uri}</p> */}
    </div>
  )
}