<script setup lang="ts">
import IconPlay from "~icons/material-symbols/play-arrow-rounded";
import TagIcon from "../components/TagIcon.vue";

import { useTemplateRef, computed } from "vue";
import { formatDistance } from "date-fns";

import { addNewError } from "@/errors/store";
import { getVideoTags } from "../utils/get_video_tags";

import type { PlaylistItem } from "../types";

const { snippet, contentDetails } = defineProps<{
	snippet: PlaylistItem["snippet"];
	contentDetails: PlaylistItem["contentDetails"];
}>();

const videoUrlCopiedToast = {
	ref: useTemplateRef<HTMLElement>("vuct"),
	anim: function () {
		if (!this.ref.value) {
			addNewError({
				title: "ERROR ANIMATING videoUrlCopiedToast",
				desc: `ref "videoUrlCopiedToast" is undefined`,
			});

			return;
		}

		this.ref.value.animate(
			{
				opacity: [0, 1, 1, 0],
				transform: [
					"translateY(50%)",
					"translateY(0)",
					"translateY(0)",
					"translateY(0)",
				],
				offset: [0, 0.2, 0.9],
				easing: ["ease-out"],
			},
			{
				duration: 1500,
				fill: "forwards",
			},
		);
	},
};

const tagIds = computed(() => {
	return getVideoTags(snippet.resourceId.videoId);
});

const videoUrl = computed(() => {
	return `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`;
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

async function writeVideoUrlToClipboard() {
	try {
		await navigator.clipboard.write([
			new ClipboardItem({ "text/plain": videoUrl.value }),
		]);

		videoUrlCopiedToast.anim();
	} catch (err) {
		addNewError({
			title: `ERROR COPYING VIDEO ID OF "${snippet.title}"`,
			desc: JSON.stringify(err, null, 3),
		});
	}
}

// ==========

import { ref } from "vue";
import { checkElementOverflow } from "@/app/utils/check_element_overflow";
import { useToolTip } from "@/app/composables/use_tooltip";

const titleTooltip = {
	ref: useTemplateRef<HTMLElement>("title"),
	text: ref(`${snippet.title}`),
};

const channelTooltip = {
	ref: useTemplateRef<HTMLElement>("channel"),
	text: ref(`${snippet.videoOwnerChannelTitle}`),
};

const publishedAtTooltip = {
	ref: useTemplateRef<HTMLElement>("publishedAt"),
	text: ref(
		`${new Date(contentDetails.videoPublishedAt).toLocaleDateString()}`,
	),
};

useToolTip(titleTooltip.ref, titleTooltip.text, () =>
	checkElementOverflow(titleTooltip.ref.value!),
);

useToolTip(channelTooltip.ref, channelTooltip.text, () =>
	checkElementOverflow(channelTooltip.ref.value!),
);

useToolTip(publishedAtTooltip.ref, publishedAtTooltip.text);
</script>

<template>
	<div
		class="flex rounded-md border-2 border-stone-200 bg-stone-200 shadow shadow-stone-400/50"
	>
		<a
			:href="videoUrl"
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
			<div class="relative mr-5 flex grow flex-col items-start text-stone-700">
				<span
					ref="title"
					class="relative mb-auto cursor-pointer text-xs font-semibold"
					@click="writeVideoUrlToClipboard"
				>
					{{ snippet.position + 1 }}. {{ snippet.title }}
				</span>

				<a
					ref="channel"
					:href="`https://www.youtube.com/channel/${snippet.videoOwnerChannelId}`"
					target="_blank"
					class="secondary-text line-clamp-1"
				>
					{{ snippet.videoOwnerChannelTitle }}
				</a>

				<span ref="publishedAt" class="secondary-text">
					{{ formatDate(contentDetails.videoPublishedAt) }}
				</span>

				<div
					ref="vuct"
					class="pointer-events-none absolute bottom-full left-0 mb-2 bg-stone-800 px-2 py-1 text-xs font-semibold text-stone-200 opacity-0"
				>
					VIDEO URL COPIED
				</div>
			</div>

			<div class="grid grid-rows-4">
				<div v-for="id in tagIds" class="relative grid place-items-center">
					<TagIcon :id="id" class="absolute h-4 w-4 rotate-90" />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="postcss">
span {
	@apply line-clamp-1;
}

.secondary-text {
	@apply text-xs opacity-80;
}
</style>
