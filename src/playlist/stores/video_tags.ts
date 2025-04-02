import { ref } from "vue";
import { defineStore } from "pinia";

import { savedVideoTags } from "./saved_video_tags";

import type { PlaylistItem, PlaylistItem_Tag } from "../types";

type VideoId = PlaylistItem["snippet"]["resourceId"]["videoId"];

export const useVideoTagsStore = defineStore("video_tags", () => {
	const localStorageKey = "video_tags";

	function saveToLocalStorage() {
		localStorage.setItem(localStorageKey, JSON.stringify(videoTags.value));
	}

	function fetchFromLocalStorage(): Record<VideoId, PlaylistItem_Tag[]> {
		return JSON.parse(localStorage.getItem(localStorageKey) ?? "{}");
	}

	// ==========

	const videoTags = ref(savedVideoTags);

	function setTag(id: VideoId, tag: PlaylistItem_Tag) {
		const tags = getVideoTags(id);
		const tagIndex = tags.indexOf(tag);

		if (tagIndex === -1) {
			tags.push(tag);
		} else {
			tags.splice(tagIndex, 1);
		}

		videoTags.value[id] = tags;
		saveToLocalStorage();
	}

	function getVideoTags(id: VideoId): PlaylistItem_Tag[] {
		return JSON.parse(JSON.stringify(videoTags.value?.[id] ?? []));
	}

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
		getVideoTags,

		activeVideo,
		setActiveVideo,
	};
});
