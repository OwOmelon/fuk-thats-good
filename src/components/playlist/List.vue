<script setup lang="ts">
import PlaylistItem_Component from "./Item.vue";

import { useTemplateRef, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getTime } from "date-fns";
import { useDataStore } from "@/stores/data";
import { useFiltersStore } from "@/stores/filters";
import { useVideoTagsStore } from "@/stores/video_tags";

import type { PlaylistItem } from "@/types";

const bottom = useTemplateRef<HTMLElement>("bottom");

const { playlists } = storeToRefs(useDataStore());
const { fetchPlaylist } = useDataStore();

const { sortDescending, activeYear, activeTagFilters, searchInput } =
	storeToRefs(useFiltersStore());

const { getVideoTags, setActiveVideo } = useVideoTagsStore();

// ==========

const currentPlaylist = computed(() => {
	return playlists.value[activeYear.value];
});

const playlistItems_Sorted = computed(() => {
	if (!currentPlaylist.value?.data) return [];

	const compareFn = sortDescending.value ? desc : asc;

	return currentPlaylist.value.data.items.toSorted(compareFn);

	function getPublishTime(a: PlaylistItem, b: PlaylistItem) {
		return {
			timeA: getTime(new Date(a.snippet.publishedAt)),
			timeB: getTime(new Date(b.snippet.publishedAt)),
		};
	}

	function desc(a: PlaylistItem, b: PlaylistItem) {
		const { timeA, timeB } = getPublishTime(a, b);

		return timeB - timeA;
	}

	function asc(a: PlaylistItem, b: PlaylistItem) {
		const { timeA, timeB } = getPublishTime(a, b);

		return timeA - timeB;
	}
});

const playlistItems_Sorted_FilteredByTags = computed(() => {
	if (!activeTagFilters.value.size) return playlistItems_Sorted.value;

	return playlistItems_Sorted.value.filter(({ snippet }) => {
		for (const tag of getVideoTags(snippet.resourceId.videoId)) {
			if (activeTagFilters.value.has(tag)) return true;
		}

		return false;
	});
});

const wholePlaylistFetched = computed(() => {
	if (!currentPlaylist.value.data) return false;

	return (
		currentPlaylist.value.data?.pageInfo?.totalResults ===
		currentPlaylist.value.data?.items?.length
	);
});

// ==========

const playlistItems_Sorted_FilteredByTagsAndSearchResults = computed(() => {
	if (!searchInput.value) return playlistItems_Sorted_FilteredByTags.value;

	const splitString_ToLowerCase = (str: string) => {
		return [...str.split(" "), ...str.split(".")].map((word) =>
			word.toLowerCase(),
		);
	};

	return playlistItems_Sorted_FilteredByTags.value.filter((item) => {
		const { title, videoOwnerChannelTitle: channel } = item.snippet;

		const titleWords = splitString_ToLowerCase(title);
		const channelWords = splitString_ToLowerCase(channel);

		for (const word of searchInput.value.split(" ")) {
			const lowercaseWord = word.toLowerCase();

			if (
				titleWords.indexOf(lowercaseWord) !== -1 ||
				channelWords.indexOf(lowercaseWord) !== -1
			) {
				return true;
			}
		}

		return false;
	});
});

// ==========

onMounted(() => {
	if (!bottom.value) {
		alert("bottom el undefined??? wadahell");

		return;
	}

	new IntersectionObserver(
		(entries) => {
			if (
				!entries[entries.length - 1].intersectionRatio ||
				wholePlaylistFetched.value
			) {
				return;
			}

			fetchPlaylist(activeYear.value);
		},
		{ root: null, threshold: 0 },
	).observe(bottom.value);
});
</script>

<template>
	<div class="grid-content">
		<div
		class="grid-content-outter relative grid grid-cols-1 grid-rows-[2rem,_auto_2rem] gap-3"
	>
		<div
			class="relative col-start-1 col-end-2 row-start-1 grid place-items-center"
		>
			<div class="absolute bottom-0 left-0">
				{{ playlistItems_Sorted_FilteredByTagsAndSearchResults.length }}/{{
					currentPlaylist.data?.pageInfo?.totalResults
				}}
			</div>

			<button
				:disabled="currentPlaylist.fetching"
				:class="[
					{ hidden: sortDescending || wholePlaylistFetched },
					'self-stretch rounded bg-white px-3 shadow disabled:opacity-50',
				]"
				@click="fetchPlaylist(activeYear)"
			>
				load more videos
			</button>
		</div>

		<div class="row-start-2 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
			<PlaylistItem_Component
				v-for="(item, _) in playlistItems_Sorted_FilteredByTagsAndSearchResults"
				:key="item.contentDetails.videoId"
				v-bind="item"
				@click="setActiveVideo(item)"
			/>
		</div> 

		<div ref="bottom" />

		<Transition name="fade">
			<div
				v-show="currentPlaylist.fetching"
				:class="[
					sortDescending ? 'row-start-3' : 'row-start-1',
					'loading pointer-events-none -z-10 col-start-1 rounded bg-stone-300',
				]"
			/>
		</Transition>
	</div>
	</div>
</template>
