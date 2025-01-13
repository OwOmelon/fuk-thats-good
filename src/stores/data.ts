import { ref } from "vue";
import { defineStore } from "pinia";

import type { Year, PlaylistItems_ListResponse } from "@/types";

export const useDataStore = defineStore("data", () => {
  // prettier-ignore
  const playlists = ref<Record<Year, { id: string; fetching: boolean; data: PlaylistItems_ListResponse | undefined }>>
    ({
      2025: { id: "PLE12YwmcrPkzlyb6zRALs5k75K7eO8M2k", fetching: false, data: undefined },
      2024: { id: "PLE12YwmcrPkzdK1cnU2MB_rJxGa3qupvE", fetching: false, data: undefined },
      2023: { id: "", fetching: false, data: undefined },
      2022: { id: "", fetching: false, data: undefined },
      2021: { id: "", fetching: false, data: undefined },
    });

  async function fetchPlaylist(year: Year) {
    const playlist = playlists.value[year];

    if (playlist.fetching) return;

    playlist.fetching = true;

    const nextpagetoken = playlist.data?.nextPageToken;
    const pageTokenUrlString = `${nextpagetoken ? `&pageToken=${nextpagetoken}` : ""}`;

    const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2C%20snippet&maxResults=50${pageTokenUrlString}&playlistId=${playlist.id}&key=${import.meta.env.VITE_YT_API_KEY}`;

    try {
      const res = await fetch(url);
      const json: PlaylistItems_ListResponse = await res.json();

      if (!playlist.data) {
        playlists.value[year].data = json;
      } else {
        playlist.data.nextPageToken = json.nextPageToken;
        playlist.data.prevPageToken = json.prevPageToken;
        playlist.data.items = [...playlist.data.items, ...json.items];
      }
    } catch (err) {
      console.log(err);
      alert(err);
    }

    playlist.fetching = false;
  }

  // ====================

  return {
    playlists,
    fetchPlaylist,
  };
});
