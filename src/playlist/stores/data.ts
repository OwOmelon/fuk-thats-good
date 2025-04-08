import { ref } from "vue";
import { defineStore } from "pinia";
import qs from "query-string";

import { addNewError } from "@/errors/store";

import type { Year, PlaylistItems_ListResponse } from "../types";

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

    const queryString = qs.stringify({
      playlistId: playlist.id,
      pageToken: playlist.data?.nextPageToken,
    });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/fetch-playlist/?${queryString}`,
      );
      const json = await res.json();

      if (json?.error) throw json;

      playlist.data = {
        ...json,
        items: [...(playlist?.data?.items ?? []), ...json.items],
      };
    } catch (err) {
      addNewError({
        title: "ERROR FETCHING PLAYLIST",
        desc: JSON.stringify(err, null, 3),
      });
    }

    playlist.fetching = false;
  }

  // ====================

  return {
    playlists,
    fetchPlaylist,
  };
});
