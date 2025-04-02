<script setup lang="ts">
import IconClose from "~icons/material-symbols/close";

import { ref, computed, watch } from "vue";
import { type Error, errors, deleteError } from "../store";

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
		}, 5000);
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
	<div v-if="errors.length" class="fixed right-10 top-10 z-20">
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
				{ 'bg-stone-50/25': displayAllErrors },
				'mt-3 flex max-h-[31.25rem] flex-col gap-1 overflow-auto p-2',
			]"
		>
			<li
				v-for="error in errors_ListDisplay"
				:id="error.id"
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

				<div class="w-[40ch] cursor-pointer bg-red-400 px-4 py-2 text-white">
					<div class="flex items-start justify-between gap-2">
						<span id="title" class="text-xl font-bold">{{ error.title }}</span>
						<span id="date-added" class="mt-[0.4rem] whitespace-nowrap text-xs">
							● {{ new Date(error.dateAdded).toLocaleTimeString() }}
						</span>
					</div>

					<p id="desc" class="text-sm">{{ error.desc }}</p>
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

li[data-focused="false"] #title {
	@apply truncate;
}

li[data-focused="false"] #desc {
	@apply line-clamp-1;
}
</style>
