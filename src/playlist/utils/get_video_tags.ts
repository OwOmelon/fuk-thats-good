import { savedVideoTags } from "../variables/saved_video_tags";
import type { PlaylistItem, PlaylistItem_Tag } from "../types";

export function getVideoTags(
	id: PlaylistItem["snippet"]["resourceId"]["videoId"],
): PlaylistItem_Tag["id"][] {
	return JSON.parse(JSON.stringify(savedVideoTags?.[id] ?? []));
}
