<script setup lang="ts">
import { useTemplateRef, computed } from "vue";
import { useToolTip } from "@/app/composables/use_tooltip";
import { playlistItem_Tags } from "../variables/playlist_item_tags";

import { type PlaylistItem_Tag } from "../types";

const { id = undefined, addTooltip = undefined } = defineProps<{
	id: PlaylistItem_Tag["id"] | undefined;
	addTooltip?: boolean | undefined;
}>();

const iconRef = useTemplateRef<HTMLElement>("tag-icon");

const fills: Record<PlaylistItem_Tag["id"], string> = {
	1: "fill-emerald-400",
	2: "fill-white",
	3: "fill-red-400",
	4: "fill-pink-400",
	5: "fill-cyan-400",
	6: "fill-orange-400",
};

const name = computed(() => {
	return (
		playlistItem_Tags?.[playlistItem_Tags.findIndex((tag) => tag.id === id)]
			?.name ?? "---"
	);
});

const fill = computed(() => {
	const fallbackFill = "fill-black";

	return id ? (fills?.[id] ?? fallbackFill) : fallbackFill;
});

if (addTooltip) useToolTip(iconRef, name);
</script>

<template>
	<svg
		ref="tag-icon"
		width="20"
		height="24"
		viewBox="0 0 20 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		:class="fill"
	>
		<path
			d="M10.0303 19.5404L9.83333 19.456L9.63637 19.5404L1 23.2417V2.66667C1 2.09203 1.22827 1.54093 1.6346 1.1346C2.04093 0.728273 2.59203 0.5 3.16667 0.5H16.5C17.0746 0.5 17.6257 0.728273 18.0321 1.1346C18.4384 1.54093 18.6667 2.09203 18.6667 2.66667V23.2417L10.0303 19.5404Z"
			stroke="#78716C"
		/>
	</svg>
</template>
