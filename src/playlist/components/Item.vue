<script setup lang="ts">
import IconPlay from "~icons/material-symbols/play-arrow-rounded";
import TagIcon from "../components/TagIcon.vue";

import { useTemplateRef, ref, onMounted } from "vue";
import { format, formatDistance } from "date-fns";
import { addNewError } from "@/errors/store";
import { getVideoTags } from "../utils/get_video_tags";
import { useToolTip } from "@/app/composables/use_tooltip";
import { checkElementOverflow } from "@/app/utils/check_element_overflow";

import type { PlaylistItem } from "../types";

// ==========

const { snippet, contentDetails } = defineProps<{
	snippet: PlaylistItem["snippet"];
	contentDetails: PlaylistItem["contentDetails"];
}>();

const itemRef = useTemplateRef("itemRef");

const tagIds = getVideoTags(snippet.resourceId.videoId);
const videoUrl = `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`;

const publishedAt_Formatted = (() => {
	const date = new Date(contentDetails.videoPublishedAt);

	return {
		date: format(date, "d MMM yyyy"),
		time: format(date, "HH:mm:ss OOOO"),
		distance: `${formatDistance(new Date(), new Date(date))} ago`,
	};
})();

onMounted(() => {
	if (!itemRef.value) return;

	const { thumbnails } = snippet;
	const url =
		thumbnails?.maxres?.url ||
		thumbnails?.standard?.url ||
		thumbnails?.high?.url ||
		thumbnails?.medium?.url ||
		thumbnails?.default?.url ||
		"";

	itemRef.value.style.setProperty("--thumbnail-url", `url(${url})`);
});

// ==========

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

async function writeVideoUrlToClipboard() {
	try {
		await navigator.clipboard.write([
			new ClipboardItem({ "text/plain": videoUrl }),
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
	text: ref(`${publishedAt_Formatted.date} | ${publishedAt_Formatted.time}`),
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
		ref="itemRef"
		class="flex rounded-md border-2 border-stone-200 bg-stone-200 shadow shadow-stone-400/50"
	>
		<a
			:href="videoUrl"
			target="_blank"
			class="group z-10 rounded-[inherit] drop-shadow-[0.125rem_0_0.125rem_rgba(0,_0,_0,_0.125)]"
		>
			<div
				class="relative grid h-24 w-24 place-items-center overflow-hidden rounded-[inherit] border-2 border-stone-100 bg-black"
			>
				<div
					class="video-thumbnail-bg h-full w-full shadow-[inset_0_0_0.25rem_rgba(0,_0,_0,_0.125)] transition-opacity group-hover:opacity-75"
				/>

				<IconPlay
					class="pointer-events-none absolute text-4xl text-stone-50 opacity-0 drop-shadow-[0_0_1rem_#000] transition-opacity group-hover:opacity-100"
				/>
			</div>
		</a>

		<div
			class="item-info relative isolate flex grow flex-col items-start p-2.5 py-1 text-xs text-stone-700"
		>
			<span
				ref="title"
				class="mb-auto cursor-pointer text-sm font-semibold"
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

			<time
				ref="publishedAt"
				:dateTime="contentDetails.videoPublishedAt"
				class="secondary-text"
			>
				{{ publishedAt_Formatted.distance }}
			</time>

			<div class="flex items-center gap-2">
				<span
					class="rounded bg-stone-600 px-1 text-xs font-semibold text-stone-200"
					>TAGS</span
				>

				<div class="flex gap-1">
					<TagIcon v-for="id in tagIds" :id="id" add-tooltip class="w-3" />
				</div>
			</div>

			<div
				ref="vuct"
				class="pointer-events-none absolute bottom-full left-0 mb-2 bg-stone-800 px-2 py-1 text-xs font-semibold text-stone-200 opacity-0"
			>
				VIDEO URL COPIED
			</div>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.video-thumbnail-bg {
	background-image: var(--thumbnail-url);
	background-size: 180%;

	@apply bg-center bg-no-repeat;
}

.item-info::before {
	content: "";
	background-image: var(--thumbnail-url);
	background-size: 180%;

	@apply pointer-events-none absolute left-0 top-0 -z-20 h-full w-full rounded bg-center bg-no-repeat opacity-15;
}

.item-info::after {
	content: "";
	background-image: linear-gradient(to right, theme(colors.stone.200), #0000);

	@apply pointer-events-none absolute left-0 top-0 -z-10 h-full w-full;
}

span {
	@apply line-clamp-1;
}
</style>
