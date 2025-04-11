import type { PlaylistItems_ListResponse } from "../types";

export function filterPlaystListItemsBySearchResults(
	items: PlaylistItems_ListResponse["items"],
	searchInput: string,
) {
	if (!searchInput) return items;

	const splitString_ToLowerCase = (str: string) => {
		return [...str.split(" "), ...str.split(".")].map((word) =>
			word.toLowerCase(),
		);
	};

	return items.filter((item) => {
		let { title, videoOwnerChannelTitle: channel, description } = item.snippet;

		if (!item.contentDetails.videoPublishedAt) return false;

		for (const searchWord of splitString_ToLowerCase(searchInput)) {
			const lowercaseSearchWord = searchWord.toLowerCase();

			switch (true) {
				case title.toLowerCase().includes(lowercaseSearchWord):
				case channel.toLowerCase().includes(lowercaseSearchWord):
				case description.toLowerCase().includes(lowercaseSearchWord):
					return true;
			}
		}

		return false;
	});
}
