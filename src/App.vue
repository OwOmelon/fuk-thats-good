<script setup lang="ts">
import Nav from "@/app/components/Nav.vue";
import Search from "@/playlist/components/Search.vue";
import Playlist from "@/playlist/components/List.vue";
import ErrorToasts from "@/errors/components/Toasts.vue";
</script>

<template>
	<Nav />
	<Search />
	<Playlist />

	<ErrorToasts />
</template>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;

*,
*::before,
*::after {
	scrollbar-width: thin;

	@apply m-0 box-border p-0;
}

body {
	@apply bg-stone-100 font-['General_Sans',_sans-serrif] text-stone-950;
}

#app {
	@apply flex flex-col gap-y-5;
}

#app > *:not(.ignore-default-boundaries),
.default-boundaries {
	@apply mx-auto w-full max-w-screen-xl;
}

.grid-content {
	@apply grid grid-cols-4 gap-4 px-6 lg:grid-cols-8 lg:px-16 xl:grid-cols-12 xl:px-24;
}

.grid-content > .grid-content-outter {
	@apply col-span-full col-start-1;
}

.grid-content > .grid-content-inner {
	@apply col-span-full col-start-1 lg:col-start-2 lg:col-end-8 xl:col-end-12;
}

/* =============== */

.fade-enter-active,
.fade-leave-active {
	transition: opacity 500ms;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.loading {
	background-image: linear-gradient(
		to right,
		#0000 0%,
		#fff 40%,
		#fff 60%,
		#0000 100%
	);
	background-size: 200% 100%;
	background-repeat: repeat;

	animation: loading 2s linear infinite;

	@apply bg-stone-300;
}

@keyframes loading {
	from {
		background-position: 100% 0;
	}

	to {
		background-position: -300% 0;
	}
}
</style>
