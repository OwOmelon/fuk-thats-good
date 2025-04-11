<script setup lang="ts">
import PlaylistItem_Component from "./Item.vue";

import { useTemplateRef, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useDataStore } from "../stores/data";
import { useFiltersStore } from "../stores/filters";
import { useVideoTagsStore } from "../stores/video_tags";

import { filterPlaystListItemsBySearchResults } from "../utils/filter_playlistitems_by_searchresults";
import { filterPlaylistItemsByTags } from "../utils/filter_playlistitems_by_tags";
import { sortPlaylistItems } from "../utils/sort_playlistitems";

// ==========

const { playlists } = storeToRefs(useDataStore());
const { fetchPlaylist } = useDataStore();

const { sortDescending, activeYear, activeTagFilters, searchInput } =
	storeToRefs(useFiltersStore());

const { setActiveVideo } = useVideoTagsStore();

// ==========

const currentPlaylist = computed(() => {
	return playlists.value[activeYear.value];
});

const currentPlaylistItems = computed(() => {
	let items = JSON.parse(
		JSON.stringify(currentPlaylist.value.data?.items ?? []),
	);

	items = filterPlaystListItemsBySearchResults(items, searchInput.value);
	items = filterPlaylistItemsByTags(items, activeTagFilters.value);
	items = sortPlaylistItems(items, sortDescending.value);

	return items;
});

const wholePlaylistFetched = computed(() => {
	if (!currentPlaylist.value.data) return false;

	return (
		currentPlaylist.value.data?.pageInfo?.totalResults ===
		currentPlaylist.value.data?.items?.length
	);
});

// ==========

const bottom = useTemplateRef("bottom");

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

			fetchCurrentPlaylist();
		},
		{ root: null, threshold: 0 },
	).observe(bottom.value);
});

function fetchCurrentPlaylist() {
	if (wholePlaylistFetched.value) return;

	fetchPlaylist(activeYear.value);
}
</script>

<template>
	<div class="grid-content">
		<div
			class="grid-content-outter relative grid grid-cols-1 grid-rows-[2rem_auto_2rem] gap-3"
		>
			<span class="z-10 col-[1/2] row-start-1 self-end justify-self-start">
				{{ currentPlaylist.data?.items?.length ?? " - " }}/{{
					currentPlaylist.data?.pageInfo?.totalResults ?? " - "
				}}
			</span>

			<div class="row-start-2 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
				<PlaylistItem_Component
					v-for="(item, _) in currentPlaylistItems"
					:key="item.contentDetails.videoId"
					v-bind="item"
					@click="setActiveVideo(item)"
				/>
			</div>

			<div ref="bottom" />

			<div
				v-if="!wholePlaylistFetched"
				:class="[
					{ loading: currentPlaylist.fetching },
					sortDescending ? 'row-start-3' : 'row-start-1',
					'place-items-center/ col-[1/2] grid w-full place-items-center rounded',
				]"
			>
				<button
					:disabled="currentPlaylist.fetching"
					class="rounded bg-white px-3 font-semibold text-neutral-700 shadow disabled:hidden"
					@click="fetchCurrentPlaylist"
				>
					fetch videos
				</button>
			</div>
		</div>
	</div>
</template>
