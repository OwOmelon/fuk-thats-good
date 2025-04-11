import { getVideoTags } from "./get_video_tags";
import type {
	PlaylistItems_ListResponse,
	PlaylistItems_TagFilters,
} from "../types";

export function filterPlaylistItemsByTags(
	items: PlaylistItems_ListResponse["items"],
	tagFilters: PlaylistItems_TagFilters,
) {
	if (!tagFilters.length) return items;

	const arr = items.filter(({ snippet }) => {
		for (const tag of getVideoTags(snippet.resourceId.videoId)) {
			if (tagFilters.includes(tag)) return true;
		}

		return false;
	});

	return arr;
}
