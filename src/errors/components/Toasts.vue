<script setup lang="ts">
import IconClose from "~icons/material-symbols/close";

import { ref, computed, watch } from "vue";
import { type Error, errors, deleteError } from "../store";

const tempDisplayDuration = 5000;
const errors_TempDisplay = ref<typeof errors.value>([]);
const displayAllErrors = ref(false);

const errors_ListDisplay = computed(() => {
	return displayAllErrors.value ? errors.value : errors_TempDisplay.value;
});

watch(
	() => errors.value.length,
	() => {
		const newError = errors.value?.[0];

		if (!newError) return;

		errors_TempDisplay.value.unshift(newError);

		setTimeout(() => {
			const newErrorIndex = errors_TempDisplay.value.findIndex(
				(err) => err.id === newError.id,
			);

			if (newErrorIndex === -1) return;

			errors_TempDisplay.value.splice(newErrorIndex, 1);
		}, tempDisplayDuration);
	},
);

function toggleErrorFocus(id: Error["id"]) {
	if (!displayAllErrors.value) displayAllErrors.value = true;

	const errorEl = document.getElementById(id)!;
	const FocusedAttr = "data-focused";

	errorEl.setAttribute(
		FocusedAttr,
		`${!(errorEl.getAttribute(FocusedAttr) === "true")}`,
	);
}
</script>

<template>
	<div
		v-if="errors.length"
		class="ignore-default-boundaries fixed right-10 top-32 z-20 drop-shadow-xl"
	>
		<button
			type="button"
			:class="[
				displayAllErrors ? 'white-red' : 'red-white',
				'relative ml-auto block h-8 w-8 rounded font-bold',
			]"
			@click="displayAllErrors = !displayAllErrors"
		>
			!!!

			<div
				:class="[
					displayAllErrors ? 'red-white' : 'white-red',
					'absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded px-1 text-xs',
				]"
			>
				{{ errors.length }}
			</div>
		</button>

		<ul
			:class="[
				{ 'bg-neutral-700/25': displayAllErrors },
				'ml-auto mt-3 flex max-h-[31.25rem] w-fit flex-col items-end gap-1 overflow-auto p-2',
			]"
		>
			<li
				v-for="error in errors_ListDisplay"
				:id="error.id"
				:key="error.id"
				class="flex"
				data-focused="false"
				@click="toggleErrorFocus(error.id)"
			>
				<button
					class="grid place-items-center bg-white px-3 text-red-400"
					@click.stop="deleteError(error.id)"
				>
					<IconClose />
				</button>

				<div
					id="content"
					class="cursor-pointer bg-red-400 px-4 py-2 text-white"
				>
					<div class="flex items-start justify-between gap-2">
						<span id="title" class="text-xl font-bold">{{ error.title }}</span>
						<span id="date-added" class="mt-[0.4rem] whitespace-nowrap text-xs">
							● &nbsp {{ new Date(error.dateAdded).toLocaleTimeString() }}
						</span>
					</div>

					<pre id="desc" class="text-wrap font-[inherit]/ text-sm">{{
						error.desc
					}}</pre>
				</div>
			</li>
		</ul>
	</div>
</template>

<style scoped lang="postcss">
.red-white {
	@apply bg-red-400 text-white;
}

.white-red {
	@apply bg-white text-red-400;
}

ul {
	scrollbar-color: theme(colors.red.400) #0000;
}

li[data-focused="false"] #content {
	@apply w-[40ch];
}

li[data-focused="false"] #title {
	@apply truncate;
}

li[data-focused="false"] #desc {
	@apply line-clamp-1;
}
</style>
