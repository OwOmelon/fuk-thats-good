export type Year = "2025" | "2024" | "2023" | "2022" | "2021";
export type PlaylistItem_Tags = [
  { id: 1; name: "music" },
  { id: 2; name: "fav" },
  { id: 3; name: "silly" },
  { id: 4; name: "short" },
  { id: 5; name: "art" },
  { id: 6; name: "lengthy" },
];
export type PlaylistItem_Tag = PlaylistItem_Tags[number];
export type PlaylistItems_TagFilters = PlaylistItem_Tag["id"][];
export type PlaylistItem = {
  kind: "youtube#playlistItem";
  etag: string;
  id: string;
  snippet: {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<string, { url: string; width: number; height: number }>;
    channelTitle: string;
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
    playlistId: string;
    position: number;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
  contentDetails: {
    videoId: string;
    startAt: string;
    endAt: string;
    note: string;
    videoPublishedAt: Date;
  };
};
export type PlaylistItems_ListResponse = {
  kind: "youtube#playlistItemListResponse";
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: PlaylistItem[];
};
