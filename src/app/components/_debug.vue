<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

import IconClose from "~icons/mdi/close";
import IconMaximize from "~icons/mdi/window-maximize";

const debugWindow = ref<HTMLElement | null>(null);
const handle = ref<HTMLElement | null>(null);

const show = ref(false);
const show_localStorageKey = "debug_show";

watch(show, (b) => {
	localStorage.setItem(show_localStorageKey, JSON.stringify(b));
});

onMounted(() => {
	window.addEventListener("keydown", (e) => {
		if (e.ctrlKey && e.shiftKey && e.shiftKey && e.code === "KeyS") {
			show.value = !show.value;
		}
	});

	show.value = JSON.parse(
		localStorage.getItem(show_localStorageKey) || "false",
	);

	handle.value?.addEventListener("mousedown", (mde) => {
		if (mde.target !== handle.value || !debugWindow.value) return;

		startDebugWindowDragOperations();

		const dragStartPos = { x: mde.clientX, y: mde.clientY };
		const { top: handleTop, left: handleLeft } =
			debugWindow.value.getBoundingClientRect();

		function dragDebugWindow(mme: MouseEvent) {
			const dragCurrentPos = { x: mme.clientX, y: mme.clientY };

			const newDragPos = {
				x:
					((dragCurrentPos.x - dragStartPos.x + handleLeft) /
						window.innerWidth) *
					100,
				y:
					((dragCurrentPos.y - dragStartPos.y + handleTop) /
						window.innerHeight) *
					100,
			};

			debugWindow.value!.style.setProperty("top", `${newDragPos.y}%`);
			debugWindow.value!.style.setProperty("left", `${newDragPos.x}%`);
		}

		function startDebugWindowDragOperations() {
			window.addEventListener("mousemove", dragDebugWindow);
			window.addEventListener("mouseup", stopDebugWindowDragOperations);
		}

		function stopDebugWindowDragOperations() {
			window.removeEventListener("mousemove", dragDebugWindow);
			window.removeEventListener("mouseup", stopDebugWindowDragOperations);
		}
	});
});

// ====================

import PlayListItem from "@/playlist/components/Item.vue";
import TagIcon from "@/playlist/components/TagIcon.vue";

import { storeToRefs } from "pinia";
import { useFiltersStore } from "@/playlist/stores/filters";
import { useVideoTagsStore } from "@/playlist/stores/video_tags";
import { tags } from "@/playlist/utils/get_tags";

const { searchInput } = storeToRefs(useFiltersStore());

const { videoTags, activeVideo } = storeToRefs(useVideoTagsStore());
const { setTag } = useVideoTagsStore();

// ====================

import { computed } from "vue";

function saveVideoTags() {
	const file = new Blob([JSON.stringify(videoTags.value, null, 3)], {
		type: "application/json",
	});

	const a = document.createElement("a");

	a.href = URL.createObjectURL(file);
	a.download = `video_tags`;

	a.click();

	setTimeout(() => {
		window.URL.revokeObjectURL(a.href);
	}, 0);
}

async function backendTest() {
	const url = "http://localhost:3000/fetch-playlist";
	const playlistId = "PLE12YwmcrPkzlyb6zRALs5k75K7eO8M2k";
	const nextPageToken = undefined;
	const queryString = `?playlistId=${playlistId}${nextPageToken ? `&nextPageToken=${nextPageToken}` : ""}`;

	console.log(`${url}/${queryString}`);

	try {
		const res = await fetch(`${url}/${queryString}`);
		const json = await res.json();

		console.log(json);
	} catch (err) {
		alert(err);
	}
}
</script>

<template>
	<div
		ref="debugWindow"
		class="fixed left-2 top-2 !w-fit min-w-[250px] border-2 border-white bg-black/50 text-xs text-white outline outline-2 outline-black backdrop-blur"
	>
		<div ref="handle" class="bg-white pb-0.5">
			<button @click="show = !show" class="ml-auto block bg-black text-base">
				<IconClose v-if="show" />
				<IconMaximize v-else />
			</button>
		</div>

		<div
			id="MAIN"
			:class="[{ hidden: !show }, 'flex flex-col items-start gap-5 p-2']"
		>
			<p>search input: {{ searchInput || "x" }}</p>

			<div
				v-if="activeVideo"
				class="flex max-h-[80vh] flex-col gap-3 overflow-auto"
			>
				<div class="border-2 border-white/50 bg-white/25 p-2">
					<PlayListItem v-bind="activeVideo" />

					<div class="mt-3 flex justify-evenly">
						<TagIcon
							v-for="tag in tags"
							:tag="tag"
							@click="setTag(activeVideo.snippet.resourceId.videoId, tag)"
						/>
					</div>
				</div>
			</div>

			<div class="buttons flex gap-2">
				<button @click="saveVideoTags">save video tags</button>
				<button @click="backendTest">backend test</button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="postcss">
#MAIN button {
	@apply block border-2 border-black bg-white px-2 text-black;
}
</style>
