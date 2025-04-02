<script setup lang="ts">
import IconSearch from "~icons/mdi/magnify";
import IconChevronLeft from "~icons/mdi/chevron-left";
import IconChevronRight from "~icons/mdi/chevron-right";

import { tags } from "../utils/get_tags";

import TagIcon from "../components/TagIcon.vue";

import { useTemplateRef } from "vue";
import { storeToRefs } from "pinia";
import { useFiltersStore } from "../stores/filters";

const { sortDescending, activeYear, activeTagFilters, searchInput } =
	storeToRefs(useFiltersStore());
const { setActiveYear, addTagFilter } = useFiltersStore();

const searchInput_El = useTemplateRef<HTMLInputElement>("searchInput_El");

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
const searchTimeoutDelay = 750;

function searchTimeoutCallback() {
	searchInput.value = searchInput_El.value?.value.trim() ?? searchInput.value;
}

function startSearchTimeout() {
	searchTimeout = setTimeout(searchTimeoutCallback, searchTimeoutDelay);
}

function clearSearchTimeout() {
	if (!searchTimeout) return;

	clearTimeout(searchTimeout);
	searchTimeout = null;
}

function onInput() {
	clearSearchTimeout();
	startSearchTimeout();
}
</script>

<template>
	<div class="grid-content">
		<div class="grid-content-inner flex flex-col">
			<div class="relative">
				<input
					ref="searchInput_El"
					type="text"
					placeholder="type in keywords"
					class="w-full rounded-md border-[0.0625rem] border-stone-500 p-3.5 pr-14 text-xl font-medium outline-none"
					@input="onInput"
				/>

				<IconSearch class="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2" />
			</div>

			<div
				class="m-4 mb-0 flex flex-wrap items-center justify-evenly gap-y-3 text-sm"
			>
				<div class="filter-container">
					<span>Year: </span>

					<button type="button" @click="setActiveYear(-1)">
						<IconChevronLeft />
					</button>

					<span class="w-10 text-center">{{ activeYear }}</span>

					<button type="button" @click="setActiveYear(1)">
						<IconChevronRight />
					</button>
				</div>

				<div class="filter-container">
					<span>Sort: </span>

					<button class="w-24" @click="sortDescending = !sortDescending">
						{{ sortDescending ? "descending" : "ascending" }}
					</button>
				</div>

				<div class="filter-container">
					<span>Tags: </span>

					<button
						v-for="tag in tags"
						:class="[
							{
								'!border-stone-300 bg-white': activeTagFilters.has(tag),
							},
							'flex items-center gap-1 rounded border-[0.0625rem] border-transparent px-2 py-1',
						]"
						@click="addTagFilter(tag)"
					>
						<TagIcon class="h-5" :tag="tag" />
						<span>{{ tag }}</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.filter-container {
	@apply flex flex-wrap items-center justify-center gap-1;
}

.filter-container > span:nth-child(1) {
	@apply mr-1 font-bold;
}
</style>
