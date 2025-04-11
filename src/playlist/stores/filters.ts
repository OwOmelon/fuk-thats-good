import { ref } from "vue";
import { defineStore } from "pinia";
import { getYear } from "date-fns";
import { years } from "../variables/years";

import type { Year, PlaylistItem_Tag, PlaylistItems_TagFilters } from "../types";

export const useFiltersStore = defineStore("filters", () => {
	const sortDescending = ref(true);
	const activeYear = ref(`${getYear(new Date())}` as Year);
	const activeTagFilters = ref<PlaylistItems_TagFilters>([]);

	function setActiveYear(dir: 1 | -1) {
		const currentIndex = years.indexOf(activeYear.value);

		if (currentIndex === 0 && dir === -1) {
			activeYear.value = years[years.length - 1];

			return;
		}

		activeYear.value = years[(currentIndex + dir) % years.length];
	}

	function addTagFilter(id: PlaylistItem_Tag["id"]) {
		const index = activeTagFilters.value.indexOf(id);

		if (index !== -1) {
			activeTagFilters.value.splice(index, 1);
		} else {
			activeTagFilters.value.push(id);
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
