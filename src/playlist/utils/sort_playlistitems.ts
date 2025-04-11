import type { PlaylistItems_ListResponse } from "../types";

export function sortPlaylistItems(
	items: PlaylistItems_ListResponse["items"],
	sortDescending: boolean,
) {
	return items.toSorted((a, b) => {
		return sortDescending
			? a.snippet.position - b.snippet.position
			: b.snippet.position - a.snippet.position;
	});
}
