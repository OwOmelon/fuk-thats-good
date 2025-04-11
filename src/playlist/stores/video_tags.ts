import { ref } from "vue";
import { defineStore } from "pinia";

import { getVideoTags } from "../utils/get_video_tags"
import { savedVideoTags } from "../variables/saved_video_tags";

import type { PlaylistItem, PlaylistItem_Tag } from "../types";

type VideoId = PlaylistItem["snippet"]["resourceId"]["videoId"];

export const useVideoTagsStore = defineStore("video_tags", () => {
	const localStorageKey = "video_tags";

	function saveToLocalStorage() {
		localStorage.setItem(localStorageKey, JSON.stringify(videoTags.value));
	}

	function fetchFromLocalStorage(): Record<VideoId, PlaylistItem_Tag["id"][]> {
		return JSON.parse(localStorage.getItem(localStorageKey) ?? "{}");
	}

	// ==========

	const videoTags = ref(savedVideoTags);

	function setTag(videoId: VideoId, tagId: PlaylistItem_Tag["id"]) {
		const videoTagIds = getVideoTags(videoId);
		const tagIndex = videoTagIds.indexOf(tagId);

		if (tagIndex === -1) {
			videoTagIds.push(tagId);
		} else {
			videoTagIds.splice(tagIndex, 1);
		}

		videoTags.value[videoId] = videoTagIds;
		saveToLocalStorage();
	}

	/*function getVideoTags(id: VideoId): PlaylistItem_Tag["id"][] {
		return JSON.parse(JSON.stringify(videoTags.value?.[id] ?? []));
	}*/

	// ==========

	const activeVideo = ref<PlaylistItem | null>(null);

	function setActiveVideo(item: PlaylistItem) {
		if (activeVideo.value) {
			if (
				activeVideo.value.snippet.resourceId.videoId ===
				item.snippet.resourceId.videoId
			) {
				activeVideo.value = null;
			} else {
				activeVideo.value = item;
			}
		} else {
			activeVideo.value = item;
		}
	}

	// ==========

	return {
		videoTags,
		setTag,

		activeVideo,
		setActiveVideo,
	};
});
