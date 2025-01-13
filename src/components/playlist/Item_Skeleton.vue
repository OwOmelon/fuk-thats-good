<script setup lang="ts">
import TagIcon from "@/components/TagIcon.vue";
</script>

<template>
	<div
		class="flex overflow-hidden rounded-md border-2 border-stone-200 bg-stone-200 shadow shadow-stone-400/50"
	>
		<a
			class="group rounded-[inherit] drop-shadow-[0.125rem_0_0.125rem_rgba(0,_0,_0,_0.125)]"
		>
			<div
				class="loading relative grid h-20 w-20 place-items-center overflow-hidden rounded-[inherit] border-2 border-stone-100 bg-stone-400/50"
			>
				<div
					class="h-full w-full bg-center bg-no-repeat shadow-[inset_0_0_0.25rem_rgba(0,_0,_0,_0.125)] transition-opacity group-hover:opacity-75"
				/>
			</div>
		</a>

		<div class="flex grow gap-2.5 p-2.5 pr-5">
			<div class="mr-5 flex grow flex-col text-stone-700">
				<span class="text-xs font-semibold"> &nbsp </span>

				<div class="flex grow flex-col justify-end text-xs opacity-80">
					<span class="w-1/2"> &nbsp </span>

					<span class="w-1/4"> &nbsp </span>
				</div>
			</div>

			<div class="grid grid-rows-4">
				<div v-for="_ in 2" class="relative grid place-items-center">
					<TagIcon
						:tag="undefined"
						class="absolute h-4 w-4 rotate-90 opacity-50"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="postcss">
span {
	@apply bg-stone-400/50;
}
</style>
