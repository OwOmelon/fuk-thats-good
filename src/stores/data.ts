import { ref } from "vue";
import { defineStore } from "pinia";
import qs from "query-string";

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

    const backendUrl = "http://localhost:3000/fetch-playlist";
    const queryString = `/?${qs.stringify({
      playlistId: playlist.id,
      pageToken: playlist.data?.nextPageToken,
    })}`;

    try {
      const res = await fetch(`${backendUrl}${queryString}`);
      const json = await res.json();

      if (json?.error) {
        alert("ERROR FETCHING PLAYLIST");

        console.error(json);

        playlist.fetching = false;

        return;
      }

      playlist.data = {
        ...json,
        items: [...(playlist?.data?.items ?? []), ...json.items],
      };
    } catch (err) {
      console.log(err);
      alert(err);

      playlist.fetching = false;
    }

    playlist.fetching = false;
  }

  // ====================

  return {
    playlists,
    fetchPlaylist,
  };
});
