import { ref } from "vue";
import { defineStore } from "pinia";
import { getYear } from "date-fns";
import { years } from "@/utils/get_years";

import type { Year, PlaylistItem_Tag } from "@/types";

export const useFiltersStore = defineStore("filters", () => {
	const sortDescending = ref(true);
	const activeYear = ref(`${getYear(new Date())}` as Year);
	const activeTagFilters = ref(new Map<PlaylistItem_Tag, 1>());

	function setActiveYear(dir: 1 | -1) {
		const currentIndex = years.indexOf(activeYear.value);

		if (currentIndex === 0 && dir === -1) {
			activeYear.value = years[years.length - 1];

			return;
		}

		activeYear.value = years[(currentIndex + dir) % years.length];
	}

	function addTagFilter(tag: PlaylistItem_Tag) {
		if (activeTagFilters.value.has(tag)) {
			activeTagFilters.value.delete(tag);
		} else {
			activeTagFilters.value.set(tag, 1);
		}
	}

	// ==========

	const searchInput = ref("");

	// ==========

	return {
		sortDescending,
		activeYear,
		activeTagFilters,

		searchInput,

		setActiveYear,
		addTagFilter,
	};
});
