<script setup lang="ts">
import IconPlay from "~icons/material-symbols/play-arrow-rounded";
import TagIcon from "@/components/TagIcon.vue";

import { computed } from "vue";
import { formatDistance } from "date-fns";
import { useVideoTagsStore } from "@/stores/video_tags";

import type { PlaylistItem } from "@/types";

const { snippet, contentDetails } = defineProps<{
	snippet: PlaylistItem["snippet"];
	contentDetails: PlaylistItem["contentDetails"];
}>();

const { getVideoTags } = useVideoTagsStore();

const tags = computed(() => {
	return getVideoTags(snippet.resourceId.videoId);
});

const thumbnailUrl = computed(() => {
	const { thumbnails } = snippet;

	return (
		thumbnails?.maxres?.url ||
		thumbnails?.standard?.url ||
		thumbnails?.high?.url ||
		thumbnails?.medium?.url ||
		thumbnails?.default?.url ||
		""
	);
});

function formatDate(date: Date) {
	return date ? `${formatDistance(new Date(), new Date(date))} ago` : "---";
}
</script>

<template>
	<div
		class="flex overflow-hidden rounded-md border-2 border-stone-200 bg-stone-200 shadow shadow-stone-400/50"
	>
		<a
			:href="`https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`"
			target="_blank"
			class="group rounded-[inherit] drop-shadow-[0.125rem_0_0.125rem_rgba(0,_0,_0,_0.125)]"
		>
			<div
				class="relative grid h-20 w-20 place-items-center overflow-hidden rounded-[inherit] border-2 border-stone-100 bg-black"
			>
				<div
					:style="{
						backgroundImage: `url(${thumbnailUrl})`,
						backgroundSize: '180%',
					}"
					class="h-full w-full bg-center bg-no-repeat shadow-[inset_0_0_0.25rem_rgba(0,_0,_0,_0.125)] transition-opacity group-hover:opacity-75"
				/>

				<IconPlay
					class="pointer-events-none absolute text-4xl text-stone-50 opacity-0 drop-shadow-[0_0_1rem_#000] transition-opacity group-hover:opacity-100"
				/>
			</div>
		</a>

		<div class="grid grow grid-cols-[auto,_1rem] gap-2.5 p-2.5">
			<div class="mr-5 flex grow flex-col text-stone-700">
				<span :title="snippet.title" class="text-xs font-semibold">
					{{ snippet.position + 1 }}. {{ snippet.title }}
				</span>

				<div class="flex grow flex-col justify-end text-xs opacity-80">
					<a
						:href="`https://www.youtube.com/channel/${snippet.videoOwnerChannelId}`"
						target="_blank"
						:title="snippet.videoOwnerChannelTitle"
						class="w-fit"
					>
						{{ snippet.videoOwnerChannelTitle }}
					</a>

					<span>
						{{ formatDate(contentDetails.videoPublishedAt) }}
					</span>
				</div>
			</div>

			<div class="grid grid-rows-4">
				<div v-for="tag in tags" class="relative grid place-items-center">
					<TagIcon :tag="tag" class="absolute h-4 w-4 rotate-90" />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="postcss">
span {
	@apply line-clamp-1;
}
</style>
