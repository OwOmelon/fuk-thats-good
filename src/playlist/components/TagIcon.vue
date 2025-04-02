<script setup lang="ts">
import { computed } from "vue";
import { type PlaylistItem_Tag } from "@/types";

const { tag = undefined } = defineProps<{
	tag: PlaylistItem_Tag | undefined;
}>();

const fills: Record<PlaylistItem_Tag, string> = {
	music: "fill-emerald-400",
	silly: "fill-red-400",
	clip: "fill-cyan-400",
	art: "fill-pink-400",
	lengthy: "fill-orange-400",
	fav: "fill-white",
};

const fill = computed(() => {
	const fallbackFill = "fill-black";

	return tag ? (fills?.[tag] ?? fallbackFill) : fallbackFill;
});
</script>

<template>
	<svg
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
